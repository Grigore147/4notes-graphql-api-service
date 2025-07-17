import { ObjectType, Field, ID, InputType, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { QueryFilters } from 'src/core/types/query-filters';
import { Entity } from './entity.types';
import { Stack } from './stack.types';
import { Notebook } from './notebook.types';

@ObjectType({ description: 'Space' })
export class Space extends Entity {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string = '';

    @Field({ nullable: true })
    createdAt: string = new Date().toISOString();

    @Field({ nullable: true })
    updatedAt: string = new Date().toISOString();

    @Field(() => [Stack])
    stacks: Stack[];

    @Field(() => [Notebook])
    notebooks: Notebook[];

    constructor(properties?: Partial<Space>) {
        super();

        this.set(properties);
    }
}

@ArgsType()
export class SpacesQueryFilters extends QueryFilters {
    @Field(() => String, { nullable: true })
    @IsOptional()
    id?: string | string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    userId?: string | string[];
}

@InputType()
export class CreateSpaceInput {
    @Field()
    @IsNotEmpty()
    @MaxLength(64)
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(1000)
    description?: string = '';
}

@InputType()
export class UpdateSpaceInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(64)
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(1000)
    description?: string;
}
