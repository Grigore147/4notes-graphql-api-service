import { IApiPaginatedResponse, IApiResponse } from 'src/core/services/api/api-response';
import { BaseRestClient } from 'src/core/services/api/base-rest-client';
import { Space } from 'src/graphql/types/space.types';

export type SpaceEntityResponse = IApiResponse<Space>;
export type SpaceCollectionResponse = IApiPaginatedResponse<Space>;

export class SpacesApi extends BaseRestClient<SpaceEntityResponse, SpaceCollectionResponse> {
    constructor(baseUrl: string, accessToken?: string) {
        super(`${baseUrl}/spaces`, accessToken);
    }
}
