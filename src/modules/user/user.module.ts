import { AuthModule } from '@base/auth';
import { AppAuthGuard } from '@guards/app.guard';
import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { UserController } from './user.controller';
import { UserDTO, UserEntity } from './user.entity';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity]), AuthModule.register(UserEntity)],
      services: [UserService, UserResolver, UserSubscriber],
      resolvers: [
        {
          ServiceClass: UserService,
          DTOClass: UserDTO,
          EntityClass: UserEntity,
          CreateDTOClass: CreateUserInput,
          UpdateDTOClass: UpdateUserInput,
          guards: [AppAuthGuard],
        },
      ],
    }),
  ],
  controllers: [UserController],
})
export class UserModule {}
