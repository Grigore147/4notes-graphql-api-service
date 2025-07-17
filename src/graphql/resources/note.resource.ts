import { Field, ObjectType } from '@nestjs/graphql';

import { Resource, ResourceCollection } from 'src/core/services/api/api-response';
import { Note } from '../types/note.types';

@ObjectType()
export class NoteResource extends Resource<Note> {
    @Field(() => Note)
    declare data: Note;
}

@ObjectType()
export class NoteResourceCollection extends ResourceCollection<Note> {
    @Field(() => [Note])
    declare data: Note[];
}
