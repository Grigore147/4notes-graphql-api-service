import { Global, Module } from '@nestjs/common';

import { SpaceService } from './space.service';
import { StackService } from './stack.service';
import { NotebookService } from './notebook.service';
import { NoteService } from './note.service';

@Global()
@Module({
    providers: [SpaceService, StackService, NotebookService, NoteService],
    exports: [SpaceService, StackService, NotebookService, NoteService]
})
export class ServicesModule {}
