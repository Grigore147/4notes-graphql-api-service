import { ObjectType, Field, ID, InputType, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

import { QueryFilters } from 'src/core/types/query-filters';
import { Entity } from './entity.types';
import { Space } from './space.types';
import { Stack } from './stack.types';
import { Note } from './note.types';

@ObjectType()
export class Notebook extends Entity {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    spaceId: string;

    @Field(() => Space, { nullable: true })
    space: Space;

    @Field()
    stackId: string;

    @Field(() => Stack, { nullable: true })
    stack: Stack;

    @Field()
    name: string;

    @Field({ nullable: true })
    createdAt: string = new Date().toISOString();

    @Field({ nullable: true })
    updatedAt: string = new Date().toISOString();

    @Field(() => [Note])
    notes: Note[] = [];

    constructor(properties?: Partial<Notebook>) {
        super();

        this.set(properties);
    }
}

@ArgsType()
export class NotebooksQueryFilters extends QueryFilters {
    @Field(() => String, { nullable: true })
    @IsOptional()
    id?: string | string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    spaceId?: string | string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    stackId?: string | string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    userId?: string | string[];
}

@InputType()
export class CreateNotebookInput {
    @Field()
    @IsNotEmpty()
    @IsUUID()
    spaceId: string;

    @Field()
    @IsNotEmpty()
    @IsUUID()
    stackId: string;

    @Field()
    name: string;
}

@InputType()
export class UpdateNotebookInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    spaceId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    stackId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    name?: string;
}
