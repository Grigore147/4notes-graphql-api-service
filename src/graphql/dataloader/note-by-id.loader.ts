import DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { NoteService } from 'src/services/note.service';
import { Note, NotesQueryFilters } from '../types/note.types';

@Injectable({ scope: Scope.REQUEST })
export class NoteByIdLoader extends DataLoader<NotesQueryFilters, Note | null> {
    constructor(private readonly noteService: NoteService) {
        super(async (queries) => {
            const query = queries[0];
            const noteIds = queries.map((value) => value.id) as string[];

            query.id = [...new Set(noteIds)];

            const notes = await this.noteService.find(query, { toEntity: true });

            return noteIds.map((noteId) => notes.data.find((note) => note.id === noteId) || null);
        });
    }
}
