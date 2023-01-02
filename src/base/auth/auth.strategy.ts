import { JWT_ACCESS_TOKEN_CONFIG } from '@configs/auth.config';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { AppUserEntity } from './auth.entity';

@Injectable()
export class AppStrategy extends PassportStrategy(JWTStrategy, 'app-base') {
  constructor(private appUserRepo: Repository<AppUserEntity>) {
    super({
      passReqToCallback: true,
      secretOrKey: JWT_ACCESS_TOKEN_CONFIG.secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(req: any, payload: any) {
    if (_.isEmpty(payload.sessionUUID)) throw new BadRequestException('Invalid Jwt Token');

    const user = await this.appUserRepo.findOne({
      where: { sessionUUID: payload?.sessionUUID },
    });
    if (!user) throw new UnauthorizedException('Invalid Session');
    if (user.isActive === false) throw new ForbiddenException('User has been suspended');

    return user;
  }
}
