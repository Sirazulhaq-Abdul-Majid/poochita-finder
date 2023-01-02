import { ID, InputType } from '@nestjs/graphql';
import { IDField, PagingStrategies } from '@nestjs-query/query-graphql';

export const DEFAULT_QUERY_OPTIONS = {
  enableTotalCount: true,
  pagingStrategy: PagingStrategies.OFFSET,
  maxResultsSize: -1,
};

export const ACCESS_TOKEN_API_NAME = 'Access Token';

@InputType()
export class RelationIdInput {
  @IDField(() => ID)
  id: number;
}
