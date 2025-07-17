import { ObjectType, Field, ID, InputType, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID, Length } from 'class-validator';

import { QueryFilters } from 'src/core/types/query-filters';
import { Entity } from './entity.types';
import { Notebook } from './notebook.types';

@ObjectType()
export class Note extends Entity {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    notebookId: string;

    @Field(() => Notebook, { nullable: true })
    notebook: Notebook;

    @Field()
    title: string = '';

    @Field()
    content: string = '';

    @Field({ nullable: true })
    createdAt: string = new Date().toISOString();

    @Field({ nullable: true })
    updatedAt: string = new Date().toISOString();

    constructor(properties?: Partial<Note>) {
        super();

        this.set(properties);
    }
}

@ArgsType()
export class NotesQueryFilters extends QueryFilters {
    @Field(() => String, { nullable: true })
    @IsOptional()
    id?: string | string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    notebookId?: string | string[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    userId?: string | string[];
}

@InputType()
export class CreateNoteInput {
    @Field()
    @IsNotEmpty()
    @IsUUID()
    notebookId: string;

    @Field()
    @Length(1, 255)
    title: string;

    @Field({ nullable: true })
    content?: string = '';
}

@InputType()
export class UpdateNoteInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    notebookId?: string;

    @Field({ nullable: true })
    @Length(1, 255)
    title?: string;

    @Field({ nullable: true })
    content?: string;
}
