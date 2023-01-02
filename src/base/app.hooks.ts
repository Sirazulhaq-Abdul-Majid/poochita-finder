import { applyDecorators, Injectable } from '@nestjs/common';
import {
  BeforeCreateMany,
  BeforeCreateManyHook,
  BeforeCreateOne,
  BeforeCreateOneHook,
  BeforeUpdateMany,
  BeforeUpdateManyHook,
  BeforeUpdateOne,
  BeforeUpdateOneHook,
  CreateManyInputType,
  CreateOneInputType,
  UpdateManyInputType,
  UpdateOneInputType,
} from '@nestjs-query/query-graphql';
import { AppContext } from '@types';

interface CreatedBy {
  createdBy: number;
  countryId: number;
}

interface UpdatedBy {
  updatedBy: number;
}

const COUNTRY_ID_HEADER_NAME = process.env.COUNTRY_ID_HEADER_NAME;

@Injectable()
export class CreatedByOneHook<T extends CreatedBy> implements BeforeCreateOneHook<T, AppContext> {
  async run(instance: CreateOneInputType<T>, context: AppContext): Promise<CreateOneInputType<T>> {
    const countryId = Number(context.req.headers[COUNTRY_ID_HEADER_NAME] ?? 0);
    const createdBy = context?.req?.user?.id;

    instance.input = { countryId, ...instance.input, createdBy };
    return instance;
  }
}

@Injectable()
export class CreatedByManyHook<T extends CreatedBy> implements BeforeCreateManyHook<T, AppContext> {
  async run(
    instance: CreateManyInputType<T>,
    context: AppContext,
  ): Promise<CreateManyInputType<T>> {
    const countryId = Number(context.req.headers[COUNTRY_ID_HEADER_NAME] ?? 0);
    const createdBy = context?.req?.user?.id;
    instance.input = instance.input.map((input) => ({ countryId, ...input, createdBy }));
    return instance;
  }
}

@Injectable()
export class UpdatedByOneHook<T extends UpdatedBy> implements BeforeUpdateOneHook<T, AppContext> {
  async run(instance: UpdateOneInputType<T>, context): Promise<UpdateOneInputType<T>> {
    instance.update.updatedBy = context?.req?.user?.id;
    return instance;
  }
}

@Injectable()
export class UpdatedByManyHook<T extends UpdatedBy>
  implements BeforeUpdateManyHook<T, any, AppContext>
{
  async run(
    instance: UpdateManyInputType<T, T>,
    context: AppContext,
  ): Promise<UpdateManyInputType<T, T>> {
    instance.update.updatedBy = context?.req?.user?.id;
    return instance;
  }
}

export const UseAppHooks = () => {
  return applyDecorators(
    BeforeCreateOne(CreatedByOneHook),
    BeforeCreateMany(CreatedByManyHook),
    BeforeUpdateOne(UpdatedByOneHook),
    BeforeUpdateMany(UpdatedByManyHook),
  );
};
