import { AppBaseEntity } from '@base/app-base.entity';
import { AppDtoDecorators } from '@base/app-dto.decorator';
import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@ObjectType()
@Entity('__table_name__')
export class __Template__Entity extends AppBaseEntity {}

@AppDtoDecorators(() => __Template__DTO)
export class __Template__DTO extends __Template__Entity {}
