import { AppUserEntity, AuthService, CurrentUser } from '@base/auth';
import { UserDTO, UserEntity } from '@entities';
import { AppAuthGuard } from '@guards/app.guard';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
  ActivateOneUserInput,
  DeactivateOneUserInput,
  ResendUserTempPasswordInput,
  UpdateUserInput,
} from './user.input';
import { UserService } from './user.service';

@UseGuards(AppAuthGuard)
@Resolver(() => UserDTO)
export class UserResolver {
  constructor(
    private readonly authService: AuthService<UserEntity>,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => UserDTO)
  async resendTempPassword(@Args('input') input: ResendUserTempPasswordInput) {
    return await this.userService.resendTempPassword(input.id);
  }

  @Query(() => UserDTO)
  async getUserMe(@CurrentUser() user: AppUserEntity) {
    return await this.userService.findById(user.id);
  }

  @Mutation(() => UserDTO)
  async updateUserMe(@CurrentUser() user: AppUserEntity, @Args('input') input: UpdateUserInput) {
    return await this.userService.updateOne(user.id, input);
  }

  @Mutation(() => UserDTO)
  async deactivateUser(
    @CurrentUser() user: AppUserEntity,
    @Args('input') input: DeactivateOneUserInput,
  ) {
    if (user.id === input.id) throw new BadRequestException('Cannot deactivate own account');
    return await this.authService.deactivateUser(input.id);
  }

  @Mutation(() => UserDTO)
  async activeUser(@CurrentUser() user: AppUserEntity, @Args('input') input: ActivateOneUserInput) {
    if (user.id === input.id) throw new BadRequestException('Cannot activate own account');
    return await this.authService.activateUser(input.id);
  }
}
