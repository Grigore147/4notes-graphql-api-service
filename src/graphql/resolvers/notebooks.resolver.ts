import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Resolver, Query, Args, Mutation, Parent, ResolveField } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { DataLoader } from 'src/core/decorators/dataloader.decorators';

import { NotebookService } from 'src/services/notebook.service';

import { Space } from '../types/space.types';
import { Stack } from '../types/stack.types';
import { Notebook, CreateNotebookInput, UpdateNotebookInput, NotebooksQueryFilters } from '../types/notebook.types';
import { Note, NotesQueryFilters } from '../types/note.types';

import { SpaceByIdLoader } from '../dataloader/space-by-id.loader';
import { StackByIdLoader } from '../dataloader/stack-by-id.loader';
import { NotesByNotebookId, SpaceById, StackById } from '../dataloader/dataloader.factory';
import { NotesByNotebookIdLoader } from '../dataloader/notes-by-notebook-id.loader';

import { NotebookResource, NotebookResourceCollection } from '../resources/notebook.resource';
import type { UserInterface } from 'src/auth/interfaces/user.entity';
import { User } from 'src/auth/decorators/user.decorator';

@Resolver(() => Notebook)
@UseGuards(GqlAuthGuard)
export class NotebooksResolver {
    private readonly logger = new Logger(NotebooksResolver.name);

    constructor(private readonly notebookService: NotebookService) {}

    @Query(() => NotebookResourceCollection)
    async notebooks(@Args() queryFilters: NotebooksQueryFilters, @User() user: UserInterface) {
        queryFilters.accessToken = user.accessToken;

        return this.notebookService.find(queryFilters);
    }

    @Query(() => NotebookResource, { nullable: true })
    async notebook(@Args('id') id: string, @User() user: UserInterface) {
        return this.notebookService.findOneById(id, { accessToken: user.accessToken });
    }

    @Mutation(() => NotebookResource)
    async createNotebook(@Args('data') data: CreateNotebookInput, @User() user: UserInterface) {
        return this.notebookService.create(data, { accessToken: user.accessToken });
    }

    @Mutation(() => NotebookResource)
    async updateNotebook(@Args('id') id: string, @Args('data') data: UpdateNotebookInput, @User() user: UserInterface) {
        return this.notebookService.update(id, data, { accessToken: user.accessToken });
    }

    @Mutation(() => NotebookResource)
    async deleteNotebook(@Args('id') id: string, @User() user: UserInterface) {
        return this.notebookService.delete(id, { accessToken: user.accessToken });
    }

    @ResolveField(() => Space)
    async space(
        @Parent() notebook: Notebook,
        @DataLoader(SpaceById) space: SpaceByIdLoader,
        @User() user: UserInterface
    ) {
        return space.load({ id: notebook.spaceId, accessToken: user.accessToken });
    }

    @ResolveField(() => Stack)
    async stack(
        @Parent() notebook: Notebook,
        @DataLoader(StackById) stack: StackByIdLoader,
        @User() user: UserInterface
    ) {
        return stack.load({ id: notebook.stackId, accessToken: user.accessToken });
    }

    @ResolveField(() => [Note])
    async notes(
        @Parent() notebook: Notebook,
        @DataLoader(NotesByNotebookId) notes: NotesByNotebookIdLoader,
        @Args() queryFilters: NotesQueryFilters,
        @User() user: UserInterface
    ) {
        queryFilters.notebookId = notebook.id;
        queryFilters.accessToken = user.accessToken;

        return notes.load(queryFilters);
    }
}
