import { AppBaseEntity } from '@base/app-base.entity';
import { ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@nestjs-query/query-graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export abstract class AppUserEntity extends AppBaseEntity {
  @FilterableField()
  @Column('varchar', { unique: true })
  readonly email: string;

  @Column('varchar')
  readonly passwordHash: string;

  @Column('varchar', { nullable: true })
  readonly sessionUUID: string;

  @Column('varchar', { nullable: true })
  readonly refreshTokenHash: string;

  @Column('bool', { default: true })
  isFirstTimeLogin: boolean;

  @FilterableField()
  @Column('bool', { default: true })
  isActive: boolean;
}

@Entity('password_reset_tokens')
export class PasswordResetTokenEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  userId: number;

  @Column('varchar')
  tokenHash: string;

  /* ------------------------------- Timestamps ------------------------------- */
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
