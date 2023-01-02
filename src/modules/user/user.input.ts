import { Field, InputType, PartialType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateUserInput {
  name: string;
  email: string;
  password: string;
  @Field(() => GraphQLUpload) photo?: FileUpload;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}

@InputType()
export class DeactivateOneUserInput {
  id: number;
}

@InputType()
export class ActivateOneUserInput {
  id: number;
}

@InputType()
export class ResendUserTempPasswordInput {
  id: number;
}
