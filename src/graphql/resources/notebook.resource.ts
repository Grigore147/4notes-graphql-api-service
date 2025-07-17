import { Field, ObjectType } from '@nestjs/graphql';

import { Resource, ResourceCollection } from 'src/core/services/api/api-response';
import { Notebook } from '../types/notebook.types';

@ObjectType()
export class NotebookResource extends Resource<Notebook> {
    @Field(() => Notebook)
    declare data: Notebook;
}

@ObjectType()
export class NotebookResourceCollection extends ResourceCollection<Notebook> {
    @Field(() => [Notebook])
    declare data: Notebook[];
}
