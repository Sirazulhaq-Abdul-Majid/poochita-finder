import { AppAuthorizerOptions } from '@base/app.type';
import { APP_AUTHORIZER_OPTIONS_KEY } from '@constants/app.constant';
import { SetMetadata } from '@nestjs/common';

export const SetAppAuthorizerOptions = (options: AppAuthorizerOptions = {}) =>
  SetMetadata(APP_AUTHORIZER_OPTIONS_KEY, {
    disabledRelationAuthorizer: options?.disabledRelationAuthorizer ?? false,
  });
