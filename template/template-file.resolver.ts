import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Filter } from '@nestjs-query/core';
import { ConnectionType } from '@nestjs-query/query-graphql';

import { __Template__DTO } from './template-file.entity';
import {
  __Template__Connection,
  __Template__Query,
  CustomCreateMany__Template__Input,
  CustomCreateOne__Template__Input,
  CustomDeleteOne__Template__Input,
  CustomFindOne__Template__Args,
  CustomUpdateOne__Template__Input,
} from './template-file.input';
import { __Template__Service } from './template-file.service';

@UseGuards()
@Resolver(() => __Template__DTO)
export class __Template__Resolver {
  constructor(private readonly __template__Service: __Template__Service) {}

  @Query(() => __Template__Connection)
  async customQuery(@Args() query: __Template__Query): Promise<ConnectionType<__Template__DTO>> {
    const filter: Filter<__Template__DTO> = {
      ...query.filter,
    };
    return __Template__Connection.createFromPromise((q) => this.__template__Service.query(q), {
      ...query,
      ...{ filter },
    });
  }

  @Query(() => __Template__DTO)
  async customFindOne__Template__(@Args() input: CustomFindOne__Template__Args) {
    return null;
  }

  @Mutation(() => __Template__DTO)
  async customCreateOne__Template__(
    @Args('input') input: CustomCreateOne__Template__Input,
  ): Promise<__Template__DTO> {
    return null;
  }

  @Mutation(() => [__Template__DTO])
  async customCreateMany__Template__(
    @Args('input') input: CustomCreateMany__Template__Input,
  ): Promise<__Template__DTO> {
    return null;
  }

  @Mutation(() => __Template__DTO)
  async customUpdateOne__Template__(
    @Args('input') input: CustomUpdateOne__Template__Input,
  ): Promise<__Template__DTO> {
    return null;
  }

  @Mutation(() => __Template__DTO)
  async customDeleteOne__Template__(
    @Args('input') input: CustomDeleteOne__Template__Input,
  ): Promise<__Template__DTO> {
    return null;
  }
}
