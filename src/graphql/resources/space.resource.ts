import { Field, ObjectType } from '@nestjs/graphql';

import { Resource, ResourceCollection } from 'src/core/services/api/api-response';
import { Space } from '../types/space.types';

@ObjectType()
export class SpaceResource extends Resource<Space> {
    @Field(() => Space)
    declare data: Space;
}

@ObjectType()
export class SpaceResourceCollection extends ResourceCollection<Space> {
    @Field(() => [Space])
    declare data: Space[];
}
