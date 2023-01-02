import { DEFAULT_QUERY_OPTIONS } from '@constants/gql.constant';
import { applyDecorators } from '@nestjs/common';
import { ObjectType } from '@nestjs/graphql';
import {
  BeforeCreateMany,
  BeforeCreateOne,
  BeforeUpdateMany,
  BeforeUpdateOne,
  QueryOptions,
  RelationTypeFunc,
} from '@nestjs-query/query-graphql';

import {
  CreatedByManyHook,
  CreatedByOneHook,
  UpdatedByManyHook,
  UpdatedByOneHook,
} from './app.hooks';
import { DTORelations } from './app.nestjs-query';

export const AppDtoDecorators = <Relation>(entity: RelationTypeFunc<Relation>) => {
  return applyDecorators(
    DTORelations(entity),
    ObjectType(entity().name.replace('DTO', '')),
    QueryOptions({ ...DEFAULT_QUERY_OPTIONS }),
    BeforeCreateOne(CreatedByOneHook),
    BeforeCreateMany(CreatedByManyHook),
    BeforeUpdateOne(UpdatedByOneHook),
    BeforeUpdateMany(UpdatedByManyHook),
  );
};
