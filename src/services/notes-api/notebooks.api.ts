import { IApiPaginatedResponse, IApiResponse } from 'src/core/services/api/api-response';
import { BaseRestClient } from 'src/core/services/api/base-rest-client';
import { Notebook } from 'src/graphql/types/notebook.types';

export type NotebookEntityResponse = IApiResponse<Notebook>;
export type NotebookCollectionResponse = IApiPaginatedResponse<Notebook>;

export class NotebooksApi extends BaseRestClient<NotebookEntityResponse, NotebookCollectionResponse> {
    constructor(baseUrl: string, accessToken?: string) {
        super(`${baseUrl}/notebooks`, accessToken);
    }
}
