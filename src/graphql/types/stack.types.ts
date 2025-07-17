import { ObjectType, Field, ID, InputType, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { QueryFilters } from 'src/core/types/query-filters';
import { Entity } from './entity.types';
import { Space } from './space.types';
import { Notebook } from './notebook.types';

@ObjectType()
export class Stack extends Entity {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    spaceId: string;

    @Field(() => Space, { nullable: true })
    space: Space;

    @Field()
    name: string;

    @Field({ nullable: true })
    createdAt: string = new Date().toISOString();

    @Field({ nullable: true })
    updatedAt: string = new Date().toISOString();

    @Field(() => [Notebook])
    notebooks: Notebook[];

    constructor(properties?: Partial<Stack>) {
        super();

        this.set(properties);
    }
}

@ArgsType()
export class StacksQueryFilters extends QueryFilters {
    @Field(() => String, { nullable: true })
    @IsOptional()
    id?: string | string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    spaceId?: string | string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    userId?: string | string[];
}

@InputType()
export class CreateStackInput {
    @Field()
    @IsNotEmpty()
    @IsUUID()
    spaceId: string;

    @Field()
    @IsNotEmpty()
    @MaxLength(64)
    name: string;
}

@InputType()
export class UpdateStackInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    spaceId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(64)
    name?: string;
}
