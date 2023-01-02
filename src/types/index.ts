import { AppAuthorizerOptions } from '@base/app.type';
import { AppUserEntity } from '@base/auth/auth.entity';
import { FileUpload } from 'graphql-upload';

export type AppContextReq = {
  headers: Record<string, string>;
  user: AppUserEntity;
  appAuthorizerOptions?: AppAuthorizerOptions;
};

export type AppContext = {
  req: AppContextReq;
};

export type GqlFileUpload = string | FileUpload;
