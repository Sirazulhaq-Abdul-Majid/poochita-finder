import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class SignInInput {
  //@example admin@example.com
  @IsNotEmpty()
  @IsEmail()
  email: string;
  //@example 1234
  @IsNotEmpty()
  password: string;
}

export class RevokeTokenInput {
  @IsNotEmpty()
  refreshToken: string;
}

export class ForgetPasswordInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordInput {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  newPassword: string;
}

export class ChangePasswordInput {
  //@example 1234
  @IsNotEmpty()
  oldPassword: string;
  //@example 1234
  @IsNotEmpty()
  newPassword: string;
}

export class DeactivateUserInput {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
