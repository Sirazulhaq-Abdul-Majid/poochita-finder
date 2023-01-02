import { Injectable } from '@nestjs/common';
import { Filter } from '@nestjs-query/core';
import { AuthorizationContext, CustomAuthorizer } from '@nestjs-query/query-graphql';

import { __Template__DTO } from './template-file.entity';

@Injectable()
export class __Template__Authorizer implements CustomAuthorizer<__Template__DTO> {
  async authorize(
    context: any,
    authorizerContext?: AuthorizationContext,
  ): Promise<Filter<__Template__DTO>> {
    return {};
  }

  async authorizeRelation(relationName: string, context: any): Promise<Filter<__Template__DTO>> {
    return {};
  }
}
