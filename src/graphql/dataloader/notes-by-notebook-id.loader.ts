import DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { NoteService } from 'src/services/note.service';
import { Note, NotesQueryFilters } from '../types/note.types';

@Injectable({ scope: Scope.REQUEST })
export class NotesByNotebookIdLoader extends DataLoader<NotesQueryFilters, Note[]> {
    constructor(private readonly noteService: NoteService) {
        super(async (queries) => {
            const query = queries[0];
            const notebookIds = queries.map((value) => value.notebookId) as string[];

            query.notebookId = [...new Set(notebookIds)];

            const notes = await this.noteService.find(query, { toEntity: true });

            return notebookIds.map((notebookId) => notes.data.filter((stack) => stack.notebookId === notebookId));
        });
    }
}
