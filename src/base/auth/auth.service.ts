import { appConfig } from '@configs/app.config';
import {
  JWT_ACCESS_TOKEN_CONFIG,
  JWT_PASSWORD_RESET_TOKEN_CONFIG,
  JWT_REFRESH_TOKEN_CONFIG,
} from '@configs/auth.config';
import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, randomUUID } from 'crypto';
import * as _ from 'lodash';
import { Repository } from 'typeorm';

import { AppUserEntity, PasswordResetTokenEntity } from './auth.entity';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService<UserEntity extends AppUserEntity> {
  logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepo: Repository<AppUserEntity>,
    private readonly passwordResetTokenRepository: Repository<PasswordResetTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async createSession(userId: number) {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    if (user.isActive === false) throw new ForbiddenException('User has been suspended');
    const sessionUUID = randomUUID();

    const accessToken = this.jwtService.sign({ sessionUUID }, JWT_ACCESS_TOKEN_CONFIG);
    const refreshToken = this.jwtService.sign({ sessionUUID }, JWT_REFRESH_TOKEN_CONFIG);

    const refreshTokenHash = await this.passwordService.hashToken(refreshToken);

    this.userRepo.merge(user, { refreshTokenHash, sessionUUID });

    await this.userRepo.save(user);

    const decoded: any = this.jwtService.decode(accessToken, { complete: true });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiry: Number(_.get(decoded, 'payload.exp', null) ?? 0),
    };
  }

  async createPasswordGeneratedUser(
    user: UserEntity,
  ): Promise<{ user: UserEntity; generatedPassword: string }> {
    const generatedPassword = this.passwordService.generatePassword();
    this.userRepo.merge(user, {
      passwordHash: await this.passwordService.hashPassword(generatedPassword),
    });

    await this.userRepo.save(user);

    return { user, generatedPassword };
  }

  async resetUserPasswordWithGeneratedPassword(
    userId: number,
  ): Promise<{ user: UserEntity; generatedPassword: string }> {
    const user = (await this.userRepo.findOneOrFail({ where: { id: userId } })) as UserEntity;
    if (!user.isFirstTimeLogin) throw new BadRequestException('User is not first time login');

    const generatedPassword = this.passwordService.generatePassword();
    this.userRepo.merge(user, {
      passwordHash: await this.passwordService.hashPassword(generatedPassword),
    });

    await this.userRepo.save(user);

    return { user, generatedPassword };
  }

  async signInWithCredentials(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user || !(await this.passwordService.comparePassword(password, user.passwordHash))) {
      throw new BadRequestException('Email or password is incorrect');
    }

    return await this.createSession(user.id);
  }

  async signOut(userId: number) {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    this.userRepo.merge(user, { sessionUUID: null, refreshTokenHash: null });

    return await this.userRepo.save(user);
  }

  async revokeToken(refreshToken: string) {
    // Check the payload is valid and not expired
    const payload = this.jwtService.verify(refreshToken, {
      secret: JWT_REFRESH_TOKEN_CONFIG.secret,
    });
    const sessionUUID = payload?.sessionUUID;
    const user = await this.userRepo.findOneOrFail({ where: { sessionUUID: sessionUUID } });

    if (!(await this.passwordService.compareToken(refreshToken, user.refreshTokenHash))) {
      throw new BadRequestException('Invalid Refresh Token');
    }

    return await this.createSession(user.id);
  }

  async generateForgetPasswordToken(email: string) {
    const user = await this.userRepo.findOne({ where: { email, isActive: true } });
    if (!user) throw new BadRequestException("Email doesn't exist");

    await this.passwordResetTokenRepository.delete({ userId: user.id });
    const token = randomBytes(64).toString('hex');

    const jwtToken = this.jwtService.sign(
      { userId: user.id, token },
      JWT_PASSWORD_RESET_TOKEN_CONFIG,
    );

    await this.passwordResetTokenRepository.save({
      userId: user.id,
      tokenHash: await this.passwordService.hashToken(token),
    });

    if (appConfig.isDevelopmentEnv) {
      this.logger.warn('Reset Password Token : ' + jwtToken);
    }

    return jwtToken;
  }

  async resetPassword(jwtToken: string, newPassword: string) {
    const { userId, token } = this.jwtService.verify(jwtToken, {
      secret: JWT_PASSWORD_RESET_TOKEN_CONFIG.secret,
    });

    const passwordResetToken = await this.passwordResetTokenRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const isValidToken = await this.passwordService.compareToken(
      token,
      passwordResetToken?.tokenHash ?? '',
    );

    if (!passwordResetToken || !isValidToken) {
      throw new BadRequestException('Invalid Password Reset Token');
    }

    await this.signOut(userId);

    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });
    this.userRepo.merge(user, {
      passwordHash: await this.passwordService.hashPassword(newPassword),
    });
    await this.userRepo.manager.transaction(async (manager) => {
      await manager.getRepository(PasswordResetTokenEntity).delete({ userId: user.id });
      await manager.save(user);
    });
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId } });

    const isValidOldPassword = await this.passwordService.comparePassword(
      oldPassword,
      user.passwordHash,
    );
    if (!isValidOldPassword) throw new BadRequestException('Invalid old password');

    this.userRepo.merge(user, {
      passwordHash: await this.passwordService.hashPassword(newPassword),
    });

    await this.userRepo.save(user);
  }

  async deactivateUser(userId: number) {
    const user = await this.signOut(userId);
    user.isActive = false;
    return await this.userRepo.save(user);
  }

  async activateUser(userId: number) {
    const user = await this.signOut(userId);
    user.isActive = true;
    return await this.userRepo.save(user);
  }
}
