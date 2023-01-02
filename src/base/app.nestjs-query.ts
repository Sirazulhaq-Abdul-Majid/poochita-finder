import { applyDecorators } from '@nestjs/common';
import {
  FilterableOffsetConnection,
  FilterableRelation,
  FilterableUnPagedRelation,
  RelationDecoratorOpts,
  RelationTypeFunc,
} from '@nestjs-query/query-graphql';

const RELATIONS_KEY = 'NESTJS_QUERY_DTO_RELATION_PROPERTY_NAME';

const DEFAULT_OPTIONS = {
  disableUpdate: true,
  disableRemove: true,
  nullable: true,
};

export const HasOne = <Relation>(
  relationTypeFunc: RelationTypeFunc<Relation>,
  options?: RelationDecoratorOpts<Relation>,
) => {
  return function (target: any, propertyKey: string) {
    const relations = target[RELATIONS_KEY] ?? [];

    const newRelation = FilterableRelation(propertyKey, relationTypeFunc, {
      ...DEFAULT_OPTIONS,
      ...options,
    });

    target[RELATIONS_KEY] = [...relations, newRelation];
  };
};

export const HasManyUnpaged = <Relation>(
  relationTypeFunc: RelationTypeFunc<Relation>,
  options?: RelationDecoratorOpts<Relation>,
) => {
  return function (target: any, propertyKey: string) {
    const relations = target[RELATIONS_KEY] ?? [];

    const newRelation = FilterableUnPagedRelation(propertyKey, relationTypeFunc, {
      ...DEFAULT_OPTIONS,
      ...options,
    });

    target[RELATIONS_KEY] = [...relations, newRelation];
  };
};

export const HasManyOffset = <Relation>(
  relationTypeFunc: RelationTypeFunc<Relation>,
  options?: RelationDecoratorOpts<Relation>,
) => {
  return function (target: any, propertyKey: string) {
    const relations = target[RELATIONS_KEY] ?? [];

    const newRelation = FilterableOffsetConnection(propertyKey, relationTypeFunc, {
      ...DEFAULT_OPTIONS,
      ...options,
    });

    target[RELATIONS_KEY] = [...relations, newRelation];
  };
};

export const DTORelations = <Relation>(entity: RelationTypeFunc<Relation>) => {
  const nestjsQueryRelations = entity().prototype[RELATIONS_KEY] ?? [];
  return applyDecorators(...nestjsQueryRelations);
};
