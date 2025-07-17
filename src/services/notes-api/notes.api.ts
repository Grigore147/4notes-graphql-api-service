import { IApiPaginatedResponse, IApiResponse } from 'src/core/services/api/api-response';
import { BaseRestClient } from 'src/core/services/api/base-rest-client';
import { Note } from 'src/graphql/types/note.types';

export type NoteEntityResponse = IApiResponse<Note>;
export type NoteCollectionResponse = IApiPaginatedResponse<Note>;

export class NotesApi extends BaseRestClient<NoteEntityResponse, NoteCollectionResponse> {
    constructor(baseUrl: string, authToken?: string) {
        super(`${baseUrl}/notes`, authToken);
    }
}
