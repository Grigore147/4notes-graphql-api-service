import DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { NotebookService } from 'src/services/notebook.service';
import { Notebook, NotebooksQueryFilters } from '../types/notebook.types';

@Injectable({ scope: Scope.REQUEST })
export class NotebooksBySpaceIdLoader extends DataLoader<NotebooksQueryFilters, Notebook[]> {
    constructor(private readonly notebookService: NotebookService) {
        super(async (queries) => {
            const query = queries[0];
            const spaceIds = queries.map((value) => value.spaceId) as string[];

            query.spaceId = [...new Set(spaceIds)];

            const notebooks = await this.notebookService.find(query, { toEntity: true });

            return spaceIds.map((spaceId) => notebooks.data.filter((notebook) => notebook.spaceId === spaceId));
        });
    }
}
