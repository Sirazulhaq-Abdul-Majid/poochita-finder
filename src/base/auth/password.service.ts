import { REFRESH_TOKEN_SALT_ROUNDS, SALT_ROUNDS } from '@configs/auth.config';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { createHash, randomInt } from 'crypto';

@Injectable()
export class PasswordService {
  generatePassword(length = 8) {
    let password = '';
    for (let i = 0; i < length; i++) {
      password += randomInt(10).toString();
    }
    return password;
  }

  async hashToken(token: string) {
    const sha256Token = createHash('sha256').update(token).digest('hex');
    return bcrypt.hash(sha256Token, REFRESH_TOKEN_SALT_ROUNDS);
  }

  async compareToken(token: string, tokenHash) {
    const sha256Token = createHash('sha256').update(token).digest('hex');
    return bcrypt.compare(sha256Token, tokenHash);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}
