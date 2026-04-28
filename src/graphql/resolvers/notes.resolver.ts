import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Resolver, Query, Args, Mutation, Parent, ResolveField } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { DataLoader } from 'src/core/decorators/dataloader.decorators';

import { NoteService } from 'src/services/note.service';

import { Note, CreateNoteInput, UpdateNoteInput, NotesQueryFilters } from '../types/note.types';
import { Notebook } from '../types/notebook.types';

import { NotebookById } from '../dataloader/dataloader.factory';
import { NotebookByIdLoader } from '../dataloader/notebook-by-id.loader';

import { NoteResource, NoteResourceCollection } from '../resources/note.resource';
import type { UserInterface } from 'src/auth/interfaces/user.entity';
import { User } from 'src/auth/decorators/user.decorator';

@Resolver(() => Note)
@UseGuards(GqlAuthGuard)
export class NotesResolver {
    private readonly logger = new Logger(NotesResolver.name);

    constructor(private readonly noteService: NoteService) {}

    @Query(() => NoteResourceCollection)
    async notes(@Args() queryFilters: NotesQueryFilters, @User() user: UserInterface) {
        queryFilters.accessToken = user.accessToken;

        return this.noteService.find(queryFilters);
    }

    @Query(() => NoteResource, { nullable: true })
    async note(@Args('id') id: string, @User() user: UserInterface) {
        return this.noteService.findOneById(id, { accessToken: user.accessToken });
    }

    @Mutation(() => NoteResource)
    async createNote(@Args('data') data: CreateNoteInput, @User() user: UserInterface) {
        return this.noteService.create(data, { accessToken: user.accessToken });
    }

    @Mutation(() => NoteResource)
    async updateNote(@Args('id') id: string, @Args('data') data: UpdateNoteInput, @User() user: UserInterface) {
        return this.noteService.update(id, data, { accessToken: user.accessToken });
    }

    @Mutation(() => NoteResource)
    async deleteNote(@Args('id') id: string, @User() user: UserInterface) {
        return this.noteService.delete(id, { accessToken: user.accessToken });
    }

    @ResolveField(() => Notebook)
    async notebook(
        @Parent() note: Note,
        @DataLoader(NotebookById) notebook: NotebookByIdLoader,
        @User() user: UserInterface
    ) {
        return notebook.load({ id: note.notebookId, accessToken: user.accessToken });
    }
}
