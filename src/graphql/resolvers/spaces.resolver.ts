import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Resolver, Query, Args, Mutation, Parent, ResolveField } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/guards/auth.guard';
import { AuthToken } from 'src/core/decorators/auth-token.decorator';
import { DataLoader } from 'src/core/decorators/dataloader.decorators';

import { SpaceService } from 'src/services/space.service';

import { Space, CreateSpaceInput, UpdateSpaceInput, SpacesQueryFilters } from '../types/space.types';
import { Stack, StacksQueryFilters } from '../types/stack.types';
import { Notebook, NotebooksQueryFilters } from '../types/notebook.types';

import { StacksBySpaceIdLoader } from '../dataloader/stacks-by-space-id.loader';
import { NotebooksBySpaceIdLoader } from '../dataloader/notebooks-by-space-id.loader';
import { NotebooksBySpaceId, StacksBySpaceId } from '../dataloader/dataloader.factory';

import { SpaceResource, SpaceResourceCollection } from '../resources/space.resource';

@Resolver(() => Space)
@UseGuards(GqlAuthGuard)
export class SpacesResolver {
    private readonly logger = new Logger(SpacesResolver.name);

    constructor(private readonly spaceService: SpaceService) {}

    @Query(() => SpaceResourceCollection)
    async spaces(@Args() queryFilters: SpacesQueryFilters, @AuthToken() authToken?: string) {
        queryFilters.authToken = authToken;

        return this.spaceService.find(queryFilters);
    }

    @Query(() => SpaceResource, { nullable: true })
    async space(@Args('id') id: string, @AuthToken() authToken?: string) {
        return this.spaceService.findOneById(id, { authToken });
    }

    @Mutation(() => SpaceResource)
    async createSpace(@Args('data') data: CreateSpaceInput, @AuthToken() authToken?: string) {
        return this.spaceService.create(data, { authToken });
    }

    @Mutation(() => SpaceResource)
    async updateSpace(@Args('id') id: string, @Args('data') data: UpdateSpaceInput, @AuthToken() authToken?: string) {
        return this.spaceService.update(id, data, { authToken });
    }

    @Mutation(() => SpaceResource)
    async deleteSpace(@Args('id') id: string, @AuthToken() authToken?: string) {
        return this.spaceService.delete(id, { authToken });
    }

    @ResolveField(() => [Stack])
    async stacks(
        @Parent() space: Space,
        // @Context() context: GqlContext,
        @DataLoader(StacksBySpaceId) stacks: StacksBySpaceIdLoader,
        @Args() queryFilters: StacksQueryFilters,
        @AuthToken() authToken?: string
    ) {
        // return this.stackService.find({ filters: { spaceId: space.id }, authToken });
        // return context.dataloaders.stacksBySpaceIdLoader.load({ spaceId: space.id, authToken });

        queryFilters.spaceId = space.id;
        queryFilters.authToken = authToken;

        return stacks.load(queryFilters);
    }

    @ResolveField(() => [Notebook])
    async notebooks(
        @Parent() space: Space,
        @DataLoader(NotebooksBySpaceId) notebooks: NotebooksBySpaceIdLoader,
        @Args() queryFilters: NotebooksQueryFilters,
        @AuthToken() authToken?: string
    ) {
        queryFilters.spaceId = space.id;
        queryFilters.authToken = authToken;

        return notebooks.load(queryFilters);
    }
}
