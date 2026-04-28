import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Resolver, Query, Args, Mutation, Parent, ResolveField } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { DataLoader } from 'src/core/decorators/dataloader.decorators';

import { StackService } from 'src/services/stack.service';

import { Space } from '../types/space.types';
import { Stack, CreateStackInput, UpdateStackInput, StacksQueryFilters } from '../types/stack.types';
import { Notebook, NotebooksQueryFilters } from '../types/notebook.types';

import { NotebooksByStackId, SpaceById } from '../dataloader/dataloader.factory';
import { SpaceByIdLoader } from '../dataloader/space-by-id.loader';
import { NotebooksByStackIdLoader } from '../dataloader/notebooks-by-stack-id.loader';

import { StackResource, StackResourceCollection } from '../resources/stack.resource';
import type { UserInterface } from 'src/auth/interfaces/user.entity';
import { User } from 'src/auth/decorators/user.decorator';

@Resolver(() => Stack)
@UseGuards(GqlAuthGuard)
export class StacksResolver {
    private readonly logger = new Logger(StacksResolver.name);

    constructor(private readonly stackService: StackService) {}

    @Query(() => StackResourceCollection)
    async stacks(@Args() queryFilters: StacksQueryFilters, @User() user: UserInterface) {
        queryFilters.accessToken = user.accessToken;

        return this.stackService.find(queryFilters);
    }

    @Query(() => StackResource, { nullable: true })
    async stack(@Args('id') id: string, @User() user: UserInterface) {
        return this.stackService.findOneById(id, { accessToken: user.accessToken });
    }

    @Mutation(() => StackResource)
    async createStack(@Args('data') data: CreateStackInput, @User() user: UserInterface) {
        return this.stackService.create(data, { accessToken: user.accessToken });
    }

    @Mutation(() => StackResource)
    async updateStack(@Args('id') id: string, @Args('data') data: UpdateStackInput, @User() user: UserInterface) {
        return this.stackService.update(id, data, { accessToken: user.accessToken });
    }

    @Mutation(() => StackResource)
    async deleteStack(@Args('id') id: string, @User() user: UserInterface) {
        return this.stackService.delete(id, { accessToken: user.accessToken });
    }

    @ResolveField(() => Space)
    async space(@Parent() stack: Stack, @DataLoader(SpaceById) space: SpaceByIdLoader, @User() user: UserInterface) {
        return space.load({ id: stack.spaceId, accessToken: user.accessToken });
    }

    @ResolveField(() => [Notebook])
    async notebooks(
        @Parent() stack: Stack,
        @DataLoader(NotebooksByStackId) notebooks: NotebooksByStackIdLoader,
        @Args() queryFilters: NotebooksQueryFilters,
        @User() user: UserInterface
    ) {
        queryFilters.stackId = stack.id;
        queryFilters.accessToken = user.accessToken;

        return notebooks.load(queryFilters);
    }
}
