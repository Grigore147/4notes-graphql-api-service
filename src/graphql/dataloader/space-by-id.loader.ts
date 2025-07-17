import DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { SpaceService } from 'src/services/space.service';
import { Space, SpacesQueryFilters } from '../types/space.types';

@Injectable({ scope: Scope.REQUEST })
export class SpaceByIdLoader extends DataLoader<SpacesQueryFilters, Space | null> {
    constructor(private readonly spaceService: SpaceService) {
        super(async (queries) => {
            const query = queries[0];
            const spaceIds = queries.map((value) => value.id) as string[];

            query.id = [...new Set(spaceIds)];

            const spaces = await this.spaceService.find(query, { toEntity: true });

            return spaceIds.map((spaceId) => spaces.data.find((space) => space.id === spaceId) || null);
        });
    }
}
