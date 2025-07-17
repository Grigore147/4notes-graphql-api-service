import DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { StackService } from 'src/services/stack.service';
import { Stack, StacksQueryFilters } from '../types/stack.types';

@Injectable({ scope: Scope.REQUEST })
export class StackByIdLoader extends DataLoader<StacksQueryFilters, Stack | null> {
    constructor(private readonly stackService: StackService) {
        super(async (queries) => {
            const query = queries[0];
            const stackIds = queries.map((value) => value.id) as string[];

            query.id = [...new Set(stackIds)];

            const stacks = await this.stackService.find(query, { toEntity: true });

            return stackIds.map((stackId) => stacks.data.find((stack) => stack.id === stackId) || null);
        });
    }
}
