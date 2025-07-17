import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
    Notebook,
    CreateNotebookInput,
    UpdateNotebookInput,
    NotebooksQueryFilters
} from 'src/graphql/types/notebook.types';
import { NotebookResource, NotebookResourceCollection } from 'src/graphql/resources/notebook.resource';

import { NotebooksApi } from './notes-api/notebooks.api';

type Options = {
    toEntity?: boolean;
};

@Injectable()
export class NotebookService {
    protected notebooksApi: NotebooksApi;

    constructor(private readonly config: ConfigService) {
        this.notebooksApi = new NotebooksApi(this.config.get<string>('notes.api.url')!);
    }

    async find(query?: NotebooksQueryFilters, options?: Options): Promise<NotebookResourceCollection> {
        const notebooks = await this.notebooksApi.find(query);

        if (options?.toEntity) {
            notebooks.data = notebooks.data.map((notebook) => new Notebook(notebook));
        }

        return new NotebookResourceCollection(notebooks);
    }

    async findOneById(id: string, query?: NotebooksQueryFilters, options?: Options): Promise<NotebookResource> {
        const notebook = await this.notebooksApi.findOneById(id, query);

        if (options?.toEntity) {
            notebook.data = new Notebook(notebook.data);
        }

        return new NotebookResource(notebook);
    }

    async create(
        data: CreateNotebookInput,
        query?: NotebooksQueryFilters,
        options?: Options
    ): Promise<NotebookResource> {
        const notebook = await this.notebooksApi.create(data, query);

        if (options?.toEntity) {
            notebook.data = new Notebook(notebook.data);
        }

        return new NotebookResource(notebook);
    }

    async update(
        id: string,
        data: UpdateNotebookInput,
        query?: NotebooksQueryFilters,
        options?: Options
    ): Promise<NotebookResource> {
        const notebook = await this.notebooksApi.update(id, data, query);

        if (options?.toEntity) {
            notebook.data = new Notebook(notebook.data);
        }

        return new NotebookResource(notebook);
    }

    async delete(id: string, query?: NotebooksQueryFilters): Promise<NotebookResource> {
        const response = await this.notebooksApi.delete(id, query);

        return new NotebookResource(response);
    }
}
