import DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { NotebookService } from 'src/services/notebook.service';
import { Notebook, NotebooksQueryFilters } from '../types/notebook.types';

@Injectable({ scope: Scope.REQUEST })
export class NotebooksByStackIdLoader extends DataLoader<NotebooksQueryFilters, Notebook[]> {
    constructor(private readonly notebookService: NotebookService) {
        super(async (queries) => {
            const query = queries[0];
            const stackIds = queries.map((value) => value.stackId) as string[];

            query.stackId = [...new Set(stackIds)];

            const notebooks = await this.notebookService.find(query, { toEntity: true });

            return stackIds.map((stackId) => notebooks.data.filter((notebook) => notebook.stackId === stackId));
        });
    }
}
