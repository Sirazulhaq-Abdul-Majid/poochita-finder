import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AppBaseAuthGuard } from './auth.guard';
import { getRequestFromContext } from './auth.utils';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = getRequestFromContext(ctx);
  return request.user;
});

//Swagger
export const UseApiAuthGuard = () => {
  return applyDecorators(ApiBearerAuth(), UseGuards(AppBaseAuthGuard));
};
