import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Resolver, Query, Args, Mutation, Parent, ResolveField } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/guards/auth.guard';
import { AuthToken } from 'src/core/decorators/auth-token.decorator';
import { DataLoader } from 'src/core/decorators/dataloader.decorators';

import { StackService } from 'src/services/stack.service';

import { Space } from '../types/space.types';
import { Stack, CreateStackInput, UpdateStackInput, StacksQueryFilters } from '../types/stack.types';
import { Notebook, NotebooksQueryFilters } from '../types/notebook.types';

import { NotebooksByStackId, SpaceById } from '../dataloader/dataloader.factory';
import { SpaceByIdLoader } from '../dataloader/space-by-id.loader';
import { NotebooksByStackIdLoader } from '../dataloader/notebooks-by-stack-id.loader';

import { StackResource, StackResourceCollection } from '../resources/stack.resource';

@Resolver(() => Stack)
@UseGuards(GqlAuthGuard)
export class StacksResolver {
    private readonly logger = new Logger(StacksResolver.name);

    constructor(private readonly stackService: StackService) {}

    @Query(() => StackResourceCollection)
    async stacks(@Args() args: StacksQueryFilters, @AuthToken() authToken?: string) {
        return this.stackService.find({ ...args, authToken });
    }

    @Query(() => StackResource, { nullable: true })
    async stack(@Args('id') id: string, @AuthToken() authToken?: string) {
        return this.stackService.findOneById(id, { authToken });
    }

    @Mutation(() => StackResource)
    async createStack(@Args('data') data: CreateStackInput, @AuthToken() authToken?: string) {
        return this.stackService.create(data, { authToken });
    }

    @Mutation(() => StackResource)
    async updateStack(@Args('id') id: string, @Args('data') data: UpdateStackInput, @AuthToken() authToken?: string) {
        return this.stackService.update(id, data, { authToken });
    }

    @Mutation(() => StackResource)
    async deleteStack(@Args('id') id: string, @AuthToken() authToken?: string) {
        return this.stackService.delete(id, { authToken });
    }

    @ResolveField(() => Space)
    async space(
        @Parent() stack: Stack,
        @DataLoader(SpaceById) space: SpaceByIdLoader,
        @AuthToken() authToken?: string
    ) {
        return space.load({ id: stack.spaceId, authToken });
    }

    @ResolveField(() => [Notebook])
    async notebooks(
        @Parent() stack: Stack,
        @DataLoader(NotebooksByStackId) notebooks: NotebooksByStackIdLoader,
        @Args() queryFilters: NotebooksQueryFilters,
        @AuthToken() authToken?: string
    ) {
        queryFilters.stackId = stack.id;
        queryFilters.authToken = authToken;

        return notebooks.load(queryFilters);
    }
}
