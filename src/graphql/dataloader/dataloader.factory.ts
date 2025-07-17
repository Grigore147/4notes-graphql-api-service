import { SpaceService } from 'src/services/space.service';
import { StackService } from 'src/services/stack.service';
import { NotebookService } from 'src/services/notebook.service';
import { NoteService } from 'src/services/note.service';

export const SpaceById = Symbol('SpaceByIdLoader');
export const StackById = Symbol('StackByIdLoader');
export const StacksBySpaceId = Symbol('StacksBySpaceIdLoader');
export const NotebookById = Symbol('NotebookByIdLoader');
export const NotebooksByStackId = Symbol('NotebooksByStackIdLoader');
export const NotebooksBySpaceId = Symbol('NotebooksBySpaceIdLoader');
export const NoteById = Symbol('NoteByIdLoader');
export const NotesByNotebookId = Symbol('NotesByNotebookIdLoader');

import { SpaceByIdLoader } from './space-by-id.loader';
import { StackByIdLoader } from './stack-by-id.loader';
import { StacksBySpaceIdLoader } from './stacks-by-space-id.loader';
import { NotebookByIdLoader } from './notebook-by-id.loader';
import { NotebooksByStackIdLoader } from './notebooks-by-stack-id.loader';
import { NotebooksBySpaceIdLoader } from './notebooks-by-space-id.loader';
import { NoteByIdLoader } from './note-by-id.loader';
import { NotesByNotebookIdLoader } from './notes-by-notebook-id.loader';

export type DataloadersMap = {
    [SpaceById]: SpaceByIdLoader;

    [StackById]: StackByIdLoader;
    [StacksBySpaceId]: StacksBySpaceIdLoader;

    [NotebookById]: NotebookByIdLoader;
    [NotebooksByStackId]: NotebooksByStackIdLoader;
    [NotebooksBySpaceId]: NotebooksBySpaceIdLoader;

    [NoteById]: NoteByIdLoader;
    [NotesByNotebookId]: NotesByNotebookIdLoader;
};

export function createDataLoaders(services: {
    spaceService: SpaceService;
    stackService: StackService;
    notebookService: NotebookService;
    noteService: NoteService;
}): DataloadersMap {
    return {
        [SpaceById]: new SpaceByIdLoader(services.spaceService),

        [StackById]: new StackByIdLoader(services.stackService),
        [StacksBySpaceId]: new StacksBySpaceIdLoader(services.stackService),

        [NotebookById]: new NotebookByIdLoader(services.notebookService),
        [NotebooksByStackId]: new NotebooksByStackIdLoader(services.notebookService),
        [NotebooksBySpaceId]: new NotebooksBySpaceIdLoader(services.notebookService),

        [NoteById]: new NoteByIdLoader(services.noteService),
        [NotesByNotebookId]: new NotesByNotebookIdLoader(services.noteService)
    };
}
