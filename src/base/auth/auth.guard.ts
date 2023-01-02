import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportGuard } from '@nestjs/passport';

import { getRequestFromContext } from './auth.utils';

@Injectable()
export class AppBaseAuthGuard extends PassportGuard('app-base') {
  getRequest(context: any) {
    return getRequestFromContext(context);
  }
}
