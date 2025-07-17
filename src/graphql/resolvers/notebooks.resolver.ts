import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Resolver, Query, Args, Mutation, Parent, ResolveField } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/guards/auth.guard';
import { AuthToken } from 'src/core/decorators/auth-token.decorator';
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

@Resolver(() => Notebook)
@UseGuards(GqlAuthGuard)
export class NotebooksResolver {
    private readonly logger = new Logger(NotebooksResolver.name);

    constructor(private readonly notebookService: NotebookService) {}

    @Query(() => NotebookResourceCollection)
    async notebooks(@Args() args: NotebooksQueryFilters, @AuthToken() authToken?: string) {
        return this.notebookService.find({ ...args, authToken });
    }

    @Query(() => NotebookResource, { nullable: true })
    async notebook(@Args('id') id: string, @AuthToken() authToken?: string) {
        return this.notebookService.findOneById(id, { authToken });
    }

    @Mutation(() => NotebookResource)
    async createNotebook(@Args('data') data: CreateNotebookInput, @AuthToken() authToken?: string) {
        return this.notebookService.create(data, { authToken });
    }

    @Mutation(() => NotebookResource)
    async updateNotebook(
        @Args('id') id: string,
        @Args('data') data: UpdateNotebookInput,
        @AuthToken() authToken?: string
    ) {
        return this.notebookService.update(id, data, { authToken });
    }

    @Mutation(() => NotebookResource)
    async deleteNotebook(@Args('id') id: string, @AuthToken() authToken?: string) {
        return this.notebookService.delete(id, { authToken });
    }

    @ResolveField(() => Space)
    async space(
        @Parent() notebook: Notebook,
        @DataLoader(SpaceById) space: SpaceByIdLoader,
        @AuthToken() authToken?: string
    ) {
        return space.load({ id: notebook.spaceId, authToken });
    }

    @ResolveField(() => Stack)
    async stack(
        @Parent() notebook: Notebook,
        @DataLoader(StackById) stack: StackByIdLoader,
        @AuthToken() authToken?: string
    ) {
        return stack.load({ id: notebook.stackId, authToken });
    }

    @ResolveField(() => [Note])
    async notes(
        @Parent() notebook: Notebook,
        @DataLoader(NotesByNotebookId) notes: NotesByNotebookIdLoader,
        @Args() queryFilters: NotesQueryFilters,
        @AuthToken() authToken?: string
    ) {
        queryFilters.notebookId = notebook.id;
        queryFilters.authToken = authToken;

        return notes.load(queryFilters);
    }
}
