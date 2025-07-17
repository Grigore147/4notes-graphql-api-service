import { Field, ObjectType } from '@nestjs/graphql';

import { Resource, ResourceCollection } from 'src/core/services/api/api-response';
import { Stack } from '../types/stack.types';

@ObjectType()
export class StackResource extends Resource<Stack> {
    @Field(() => Stack)
    declare data: Stack;
}

@ObjectType()
export class StackResourceCollection extends ResourceCollection<Stack> {
    @Field(() => [Stack])
    declare data: Stack[];
}
