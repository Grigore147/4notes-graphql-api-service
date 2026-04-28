import { IApiPaginatedResponse, IApiResponse } from 'src/core/services/api/api-response';
import { BaseRestClient } from 'src/core/services/api/base-rest-client';
import { Stack } from 'src/graphql/types/stack.types';

export type StackEntityResponse = IApiResponse<Stack>;
export type StackCollectionResponse = IApiPaginatedResponse<Stack>;

export class StacksApi extends BaseRestClient<StackEntityResponse, StackCollectionResponse> {
    constructor(baseUrl: string, accessToken?: string) {
        super(`${baseUrl}/stacks`, accessToken);
    }
}
