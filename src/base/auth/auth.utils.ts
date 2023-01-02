import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const getRequestFromContext = (context: ExecutionContext) => {
  if (context.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req;
  }
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest();
  }

  throw new BadRequestException('Unknown Context');
};
