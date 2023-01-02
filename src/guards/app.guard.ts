import { AppBaseAuthGuard } from '@base/auth';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AppAuthGuard extends AppBaseAuthGuard {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    return (await super.canActivate(context)) as boolean;
  }
}
