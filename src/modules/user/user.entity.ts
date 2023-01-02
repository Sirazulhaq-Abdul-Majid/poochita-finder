import { AppDtoDecorators } from '@base/app-dto.decorator';
import { AppUserEntity } from '@base/auth';
import { ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@nestjs-query/query-graphql';
import { FileUpload } from 'graphql-upload';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity('users')
export class UserEntity extends AppUserEntity {
  @FilterableField()
  @Column('varchar')
  name: string;

  @FilterableField()
  @Column('varchar')
  username:string; 

  @FilterableField(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  photo?: string | FileUpload;
}

@AppDtoDecorators(() => UserDTO)
export class UserDTO extends UserEntity {}
