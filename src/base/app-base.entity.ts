import { GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { FilterableField, IDField } from '@nestjs-query/query-graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class AppBaseEntity {
  @IDField(() => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /* --------------------------------- Records -------------------------------- */
  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  createdBy?: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  updatedBy?: number;

  @FilterableField({ nullable: true })
  @Column({ nullable: true })
  deletedBy?: number;

  /* ------------------------------- Timestamps ------------------------------- */

  @FilterableField(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;

  @FilterableField(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @FilterableField(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date;
}
