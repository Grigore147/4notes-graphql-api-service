import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Stack, CreateStackInput, UpdateStackInput, StacksQueryFilters } from 'src/graphql/types/stack.types';
import { StackResource, StackResourceCollection } from 'src/graphql/resources/stack.resource';

import { StacksApi } from './notes-api/stacks.api';

type Options = {
    toEntity?: boolean;
};

@Injectable()
export class StackService {
    protected stacksApi: StacksApi;

    constructor(private readonly config: ConfigService) {
        this.stacksApi = new StacksApi(this.config.get<string>('notes.api.url')!);
    }

    async find(query?: StacksQueryFilters, options?: Options): Promise<StackResourceCollection> {
        const stacks = await this.stacksApi.find(query);

        if (options?.toEntity) {
            stacks.data = stacks.data.map((stack) => new Stack(stack));
        }

        return new StackResourceCollection(stacks);
    }

    async findOneById(id: string, query?: StacksQueryFilters, options?: Options): Promise<StackResource> {
        const stack = await this.stacksApi.findOneById(id, query);

        if (options?.toEntity) {
            stack.data = new Stack(stack.data);
        }

        return new StackResource(stack);
    }

    async create(data: CreateStackInput, query?: StacksQueryFilters, options?: Options): Promise<StackResource> {
        const stack = await this.stacksApi.create(data, query);

        if (options?.toEntity) {
            stack.data = new Stack(stack.data);
        }

        return new StackResource(stack);
    }

    async update(
        id: string,
        data: UpdateStackInput,
        query?: StacksQueryFilters,
        options?: Options
    ): Promise<StackResource> {
        const stack = await this.stacksApi.update(id, data, query);

        if (options?.toEntity) {
            stack.data = new Stack(stack.data);
        }

        return new StackResource(stack);
    }

    async delete(id: string, query?: StacksQueryFilters): Promise<StackResource> {
        const response = await this.stacksApi.delete(id, query);

        return new StackResource(response);
    }
}
