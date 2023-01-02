import { AuthService } from '@base/auth';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserInput } from './user.input';

@Injectable()
@QueryService(UserEntity)
export class UserService extends TypeOrmQueryService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    userRepo: Repository<UserEntity>,
    private authService: AuthService<UserEntity>,
  ) {
    super(userRepo, { useSoftDelete: true });
  }

  async createUserWithGeneratedPassword(input: CreateUserInput & { createdBy: number }) {
    const user = this.repo.create(input);

    const { generatedPassword } = await this.authService.createPasswordGeneratedUser(user);

    // this.mailService.sendEmailVerification(user.email, generatedPassword);

    return user;
  }

  async resendTempPassword(userId: number) {
    const { user, generatedPassword } =
      await this.authService.resetUserPasswordWithGeneratedPassword(userId);
    // await this.mailService.sendEmailVerification(user.email, generatedPassword);
    return user;
  }

  async forgetPassword(email: string) {
    const token = await this.authService.generateForgetPasswordToken(email);
    if (token) {
      // this.mailService.sendResetPasswordVerification(email, token);
    }
  }
}
