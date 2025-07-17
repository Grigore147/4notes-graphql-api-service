import DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { NotebookService } from 'src/services/notebook.service';
import { Notebook, NotebooksQueryFilters } from '../types/notebook.types';

@Injectable({ scope: Scope.REQUEST })
export class NotebookByIdLoader extends DataLoader<NotebooksQueryFilters, Notebook | null> {
    constructor(private readonly notebookService: NotebookService) {
        super(async (queries) => {
            const query = queries[0];
            const notebookIds = queries.map((value) => value.id) as string[];

            query.id = [...new Set(notebookIds)];

            const notebooks = await this.notebookService.find(query, { toEntity: true });

            return notebookIds.map(
                (notebookId) => notebooks.data.find((notebook) => notebook.id === notebookId) || null
            );
        });
    }
}
