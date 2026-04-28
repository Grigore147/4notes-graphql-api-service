import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Space } from 'src/notes/entities/space.entity';
import { Stack } from 'src/notes/entities/stack.entity';
import { Notebook } from 'src/notes/entities/notebook.entity';
import { Note } from 'src/notes/entities/note.entity';

@Controller()
export class NotesController {
    constructor(
        @InjectRepository(Space)
        private spacesRepository: Repository<Space>,
        @InjectRepository(Stack)
        private stacksRepository: Repository<Stack>,
        @InjectRepository(Notebook)
        private notebooksRepository: Repository<Notebook>,
        @InjectRepository(Note)
        private notesRepository: Repository<Note>
    ) {}

    @Get('/api/spaces')
    listSpaces(): Promise<Space[]> {
        return this.spacesRepository.find({
            relations: {
                stacks: true,
                notebooks: true
            }
        });
    }

    @Get('/api/stacks')
    listStacks(): Promise<Stack[]> {
        return this.stacksRepository.find({
            relations: {
                space: true,
                notebooks: true
            }
        });
        // return this.stacksRepository
        //     .createQueryBuilder('stack')
        //     .leftJoinAndSelect('stack.space', 'space')
        //     .select(['stack.id', 'stack.name', 'space.id', 'space.name'])
        //     .getMany();
    }

    @Get('/api/notebooks')
    listNotebooks(): Promise<Notebook[]> {
        // return this.notebooksRepository.find();
        return this.notebooksRepository.find({
            relations: {
                space: true,
                stack: true,
                notes: true
            }
        });
    }

    @Get('/api/notes')
    listNotes(): Promise<Note[]> {
        // return this.notesRepository.find();
        return this.notesRepository.find({
            relations: {
                notebook: {
                    space: true,
                    stack: true
                }
            }
        });
    }
}
