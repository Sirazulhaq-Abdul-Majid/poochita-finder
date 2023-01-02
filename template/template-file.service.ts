import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Repository } from 'typeorm';

import { __Template__Entity } from './template-file.entity';

@Injectable()
@QueryService(__Template__Entity)
export class __Template__Service extends TypeOrmQueryService<__Template__Entity> {
  constructor(
    @InjectRepository(__Template__Entity) __template__Repo: Repository<__Template__Entity>,
  ) {
    super(__template__Repo, { useSoftDelete: true });
  }
}
