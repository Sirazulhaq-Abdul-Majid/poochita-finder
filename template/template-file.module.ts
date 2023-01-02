import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';

import { __Template__DTO, __Template__Entity } from './template-file.entity';
import { Create__Template__Input, Update__Template__Input } from './template-file.input';
import { __Template__Resolver } from './template-file.resolver';
import { __Template__Service } from './template-file.service';
import { __Template__Subscriber } from './template-file.subscriber';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([__Template__Entity])],
      services: [__Template__Service, __Template__Subscriber, __Template__Resolver],
      resolvers: [
        {
          ServiceClass: __Template__Service,
          DTOClass: __Template__DTO,
          EntityClass: __Template__Entity,
          CreateDTOClass: Create__Template__Input,
          UpdateDTOClass: Update__Template__Input,
          guards: [],
        },
      ],
    }),
  ],
  controllers: [],
})
export class __Template__Module {}
