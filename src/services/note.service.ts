import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Note, CreateNoteInput, UpdateNoteInput, NotesQueryFilters } from 'src/graphql/types/note.types';
import { NoteResource, NoteResourceCollection } from 'src/graphql/resources/note.resource';

import { NotesApi } from './notes-api/notes.api';

type Options = {
    toEntity?: boolean;
};

@Injectable()
export class NoteService {
    protected notesApi: NotesApi;

    constructor(private readonly config: ConfigService) {
        this.notesApi = new NotesApi(this.config.get<string>('notes.api.url')!);
    }

    async find(query?: NotesQueryFilters, options?: Options): Promise<NoteResourceCollection> {
        const notes = await this.notesApi.find(query);

        if (options?.toEntity) {
            notes.data = notes.data.map((note) => new Note(note));
        }

        return new NoteResourceCollection(notes);
    }

    async findOneById(id: string, query?: NotesQueryFilters, options?: Options): Promise<NoteResource> {
        const note = await this.notesApi.findOneById(id, query);

        if (options?.toEntity) {
            note.data = new Note(note.data);
        }

        return new NoteResource(note);
    }

    async create(data: CreateNoteInput, query?: NotesQueryFilters, options?: Options): Promise<NoteResource> {
        const note = await this.notesApi.create(data, query);

        if (options?.toEntity) {
            note.data = new Note(note.data);
        }

        return new NoteResource(note);
    }

    async update(
        id: string,
        data: UpdateNoteInput,
        query?: NotesQueryFilters,
        options?: Options
    ): Promise<NoteResource> {
        const note = await this.notesApi.update(id, data, query);

        if (options?.toEntity) {
            note.data = new Note(note.data);
        }

        return new NoteResource(note);
    }

    async delete(id: string, query?: NotesQueryFilters): Promise<NoteResource> {
        const response = await this.notesApi.delete(id, query);

        return new NoteResource(response);
    }
}
