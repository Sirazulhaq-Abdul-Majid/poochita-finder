import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { AppUserEntity, PasswordResetTokenEntity } from './auth.entity';
import { AuthService } from './auth.service';
import { AppStrategy } from './auth.strategy';
import { PasswordService } from './password.service';

@Module({ imports: [JwtModule.register({})] })
export class AuthModule {
  static register(entityClass: typeof AppUserEntity) {
    const strategyFactory = {
      provide: AppStrategy,
      useFactory: (dataSource: DataSource) => {
        return new AppStrategy(dataSource.getRepository(entityClass));
      },
      inject: [DataSource],
    };

    const authServiceFactory = {
      provide: AuthService,
      useFactory: (
        userRepo: Repository<AppUserEntity>,
        passwordResetRepo: Repository<PasswordResetTokenEntity>,
        jwtService: JwtService,
        passwordService: PasswordService,
      ) => {
        return new AuthService(userRepo, passwordResetRepo, jwtService, passwordService);
      },
      inject: [
        getRepositoryToken(entityClass),
        getRepositoryToken(PasswordResetTokenEntity),
        JwtService,
        PasswordService,
      ],
    };

    return {
      module: AuthModule,
      imports: [TypeOrmModule.forFeature([entityClass, PasswordResetTokenEntity])],
      providers: [PasswordService, strategyFactory, authServiceFactory],
      exports: [PasswordService, strategyFactory, authServiceFactory],
    };
  }
}
