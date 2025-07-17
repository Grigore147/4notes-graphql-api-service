import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Space, CreateSpaceInput, UpdateSpaceInput, SpacesQueryFilters } from 'src/graphql/types/space.types';
import { SpaceResource, SpaceResourceCollection } from 'src/graphql/resources/space.resource';

import { SpacesApi } from './notes-api/spaces.api';

type Options = {
    toEntity?: boolean;
};

@Injectable()
export class SpaceService {
    protected spacesApi: SpacesApi;

    constructor(private readonly config: ConfigService) {
        this.spacesApi = new SpacesApi(this.config.get<string>('notes.api.url')!);
    }

    async find(query?: SpacesQueryFilters, options?: Options): Promise<SpaceResourceCollection> {
        const spaces = await this.spacesApi.find(query);

        if (options?.toEntity) {
            spaces.data = spaces.data.map((space) => new Space(space));
        }

        return new SpaceResourceCollection(spaces);
    }

    async findOneById(id: string, query?: SpacesQueryFilters, options?: Options): Promise<SpaceResource> {
        const space = await this.spacesApi.findOneById(id, query);

        if (options?.toEntity) {
            space.data = new Space(space.data);
        }

        return new SpaceResource(space);
    }

    async create(data: CreateSpaceInput, query?: SpacesQueryFilters, options?: Options): Promise<SpaceResource> {
        const space = await this.spacesApi.create(data, query);

        if (options?.toEntity) {
            space.data = new Space(space.data);
        }

        return new SpaceResource(space);
    }

    async update(
        id: string,
        data: UpdateSpaceInput,
        query?: SpacesQueryFilters,
        options?: Options
    ): Promise<SpaceResource> {
        const space = await this.spacesApi.update(id, data, query);

        if (options?.toEntity) {
            space.data = new Space(space.data);
        }

        return new SpaceResource(space);
    }

    async delete(id: string, query?: SpacesQueryFilters): Promise<SpaceResource> {
        const response = await this.spacesApi.delete(id, query);

        return new SpaceResource(response);
    }
}
