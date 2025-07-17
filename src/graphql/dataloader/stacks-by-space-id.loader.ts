import DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { StackService } from 'src/services/stack.service';
import { Stack, StacksQueryFilters } from '../types/stack.types';

@Injectable({ scope: Scope.REQUEST })
export class StacksBySpaceIdLoader extends DataLoader<StacksQueryFilters, Stack[]> {
    constructor(private readonly stackService: StackService) {
        super(async (queries) => {
            const query = queries[0];
            const spaceIds = queries.map((value) => value.spaceId) as string[];

            query.spaceId = [...new Set(spaceIds)];

            const stacks = await this.stackService.find(query, { toEntity: true });

            return spaceIds.map((spaceId) => stacks.data.filter((stack) => stack.spaceId === spaceId));
        });
    }
}
