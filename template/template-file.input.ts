import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import {
  CreateManyInputType,
  CreateOneInputType,
  DeleteOneInputType,
  FindOneArgsType,
  QueryArgsType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';

import { __Template__DTO } from './template-file.entity';

@InputType()
export class Create__Template__Input {}

@InputType()
export class Update__Template__Input extends PartialType(Create__Template__Input) {}

/* ------------------------- Custom Resolver Inputs ------------------------- */
@ArgsType()
export class __Template__Query extends QueryArgsType(__Template__DTO) {}
export const __Template__Connection = __Template__Query.ConnectionType;

@ArgsType()
export class CustomFindOne__Template__Args extends FindOneArgsType(__Template__DTO) {}

@InputType()
export class CustomCreateOne__Template__Input extends CreateOneInputType(
  '__template__',
  Create__Template__Input,
) {}

@InputType()
export class CustomCreateMany__Template__Input extends CreateManyInputType(
  '__templates__',
  Create__Template__Input,
) {}

@InputType()
export class CustomUpdateOne__Template__Input extends UpdateOneInputType(
  __Template__DTO,
  Update__Template__Input,
) {}

@InputType()
export class CustomDeleteOne__Template__Input extends DeleteOneInputType(__Template__DTO) {}
