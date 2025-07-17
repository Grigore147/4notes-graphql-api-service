import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Resolver, Query, Args, Mutation, Parent, ResolveField } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/guards/auth.guard';
import { AuthToken } from 'src/core/decorators/auth-token.decorator';
import { DataLoader } from 'src/core/decorators/dataloader.decorators';

import { NoteService } from 'src/services/note.service';

import { Note, CreateNoteInput, UpdateNoteInput, NotesQueryFilters } from '../types/note.types';
import { Notebook } from '../types/notebook.types';

import { NotebookById } from '../dataloader/dataloader.factory';
import { NotebookByIdLoader } from '../dataloader/notebook-by-id.loader';

import { NoteResource, NoteResourceCollection } from '../resources/note.resource';

@Resolver(() => Note)
@UseGuards(GqlAuthGuard)
export class NotesResolver {
    private readonly logger = new Logger(NotesResolver.name);

    constructor(private readonly noteService: NoteService) {}

    @Query(() => NoteResourceCollection)
    async notes(@Args() args: NotesQueryFilters, @AuthToken() authToken?: string) {
        return this.noteService.find({ ...args, authToken });
    }

    @Query(() => NoteResource, { nullable: true })
    async note(@Args('id') id: string, @AuthToken() authToken?: string) {
        return this.noteService.findOneById(id, { authToken });
    }

    @Mutation(() => NoteResource)
    async createNote(@Args('data') data: CreateNoteInput, @AuthToken() authToken?: string) {
        return this.noteService.create(data, { authToken });
    }

    @Mutation(() => NoteResource)
    async updateNote(@Args('id') id: string, @Args('data') data: UpdateNoteInput, @AuthToken() authToken?: string) {
        return this.noteService.update(id, data, { authToken });
    }

    @Mutation(() => NoteResource)
    async deleteNote(@Args('id') id: string, @AuthToken() authToken?: string) {
        return this.noteService.delete(id, { authToken });
    }

    @ResolveField(() => Notebook)
    async notebook(
        @Parent() note: Note,
        @DataLoader(NotebookById) notebook: NotebookByIdLoader,
        @AuthToken() authToken?: string
    ) {
        return notebook.load({ id: note.notebookId, authToken });
    }
}
