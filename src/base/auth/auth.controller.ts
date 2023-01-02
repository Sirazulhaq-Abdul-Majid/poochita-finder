import { Body, Get, Post } from '@nestjs/common';

import { CurrentUser, UseApiAuthGuard } from './auth.decorator';
import { AppUserEntity } from './auth.entity';
import {
  ChangePasswordInput,
  ResetPasswordInput,
  RevokeTokenInput,
  SignInInput,
} from './auth.input';
import { AuthTokenResDTO } from './auth.res.dto';
import { AuthService } from './auth.service';

export class AuthBaseController {
  constructor(private authService: AuthService<any>) {}
  /** Sign In */
  @Post('sign-in')
  async signIn(@Body() input: SignInInput): Promise<AuthTokenResDTO> {
    return await this.authService.signInWithCredentials(input.email, input.password);
  }

  /** Sign In */
  @Get('check-session')
  @UseApiAuthGuard()
  async checkSession(@CurrentUser() user: AppUserEntity) {
    return { id: user.id };
  }

  /** Sign Out */
  @Get('sign-out')
  @UseApiAuthGuard()
  async signOut(@CurrentUser() user: AppUserEntity) {
    await this.authService.signOut(user.id);
  }

  /** Refresh Token */
  @Post('revoke-authentication')
  async revokeToken(@Body() input: RevokeTokenInput): Promise<AuthTokenResDTO> {
    return await this.authService.revokeToken(input.refreshToken);
  }

  /** Reset Password */
  @Post('reset-password')
  async resetPassword(@Body() input: ResetPasswordInput): Promise<any> {
    await this.authService.resetPassword(input.token, input.newPassword);
  }

  /** Change Password */
  @UseApiAuthGuard()
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: AppUserEntity,
    @Body() input: ChangePasswordInput,
  ): Promise<any> {
    await this.authService.changePassword(user.id, input.oldPassword, input.newPassword);
  }

  /** Deactivate Current Account */
  @UseApiAuthGuard()
  @Post('deactivate-current-account')
  async deactivateUser(@CurrentUser() user: AppUserEntity): Promise<any> {
    await this.authService.deactivateUser(user.id);
  }
}
