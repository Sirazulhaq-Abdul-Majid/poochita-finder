import { AuthBaseController, ForgetPasswordInput } from '@base/auth';
import { AuthService } from '@base/auth/auth.service';
import { UserEntity } from '@entities';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

@ApiTags('User Auth')
@Controller('auth/user')
export class UserController extends AuthBaseController {
  constructor(authService: AuthService<UserEntity>, private userService: UserService) {
    super(authService);
  }

  /** Reset Password */
  @Post('forget-password')
  async forgetPassword(@Body() input: ForgetPasswordInput): Promise<any> {
    await this.userService.forgetPassword(input.email);
  }
}
