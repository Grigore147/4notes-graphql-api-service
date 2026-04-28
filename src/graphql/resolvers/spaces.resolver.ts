import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Resolver, Query, Args, Mutation, Parent, ResolveField } from '@nestjs/graphql';

import { User } from 'src/auth/decorators/user.decorator';
import type { UserInterface } from 'src/auth/interfaces/user.entity';

import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
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
    async spaces(@Args() queryFilters: SpacesQueryFilters, @User() user: UserInterface) {
        queryFilters.accessToken = user.accessToken;

        return this.spaceService.find(queryFilters);
    }

    @Query(() => SpaceResource, { nullable: true })
    async space(@Args('id') id: string, @User() user: UserInterface) {
        return this.spaceService.findOneById(id, { accessToken: user.accessToken });
    }

    @Mutation(() => SpaceResource)
    async createSpace(@Args('data') data: CreateSpaceInput, @User() user: UserInterface) {
        return this.spaceService.create(data, { accessToken: user.accessToken });
    }

    @Mutation(() => SpaceResource)
    async updateSpace(@Args('id') id: string, @Args('data') data: UpdateSpaceInput, @User() user: UserInterface) {
        return this.spaceService.update(id, data, { accessToken: user.accessToken });
    }

    @Mutation(() => SpaceResource)
    async deleteSpace(@Args('id') id: string, @User() user: UserInterface) {
        return this.spaceService.delete(id, { accessToken: user.accessToken });
    }

    @ResolveField(() => [Stack])
    async stacks(
        @Parent() space: Space,
        // @Context() context: GqlContext,
        @DataLoader(StacksBySpaceId) stacks: StacksBySpaceIdLoader,
        @Args() queryFilters: StacksQueryFilters,
        @User() user: UserInterface
    ) {
        // return this.stackService.find({ filters: { spaceId: space.id }, accessToken });
        // return context.dataloaders.stacksBySpaceIdLoader.load({ spaceId: space.id, accessToken });

        queryFilters.spaceId = space.id;
        queryFilters.accessToken = user.accessToken;

        return stacks.load(queryFilters);
    }

    @ResolveField(() => [Notebook])
    async notebooks(
        @Parent() space: Space,
        @DataLoader(NotebooksBySpaceId) notebooks: NotebooksBySpaceIdLoader,
        @Args() queryFilters: NotebooksQueryFilters,
        @User() user: UserInterface
    ) {
        queryFilters.spaceId = space.id;
        queryFilters.accessToken = user.accessToken;

        return notebooks.load(queryFilters);
    }
}
