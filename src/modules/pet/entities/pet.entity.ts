import { AppBaseEntity, AppUserEntity, UserEntity } from "@entities";
import { FilterableField } from "@nestjs-query/query-graphql";
import { ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@ObjectType()
@Entity('pets')
export class PetEntity extends AppBaseEntity{
    @FilterableField()
    @Column('varchar')
    name:string;

    @FilterableField()
    @Column()
    age:number;

    @FilterableField()
    @Column()
    type:string;

    @FilterableField()
    @Column()
    traits:string;

    @FilterableField()
    @Column('bit')
    gender: boolean;

    @FilterableField()
    @Column('bit')
    spay: boolean;

    @OneToOne(()=>UserEntity)
    @JoinColumn()
    user: UserEntity;
}