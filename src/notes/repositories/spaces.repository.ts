import { Injectable } from '@nestjs/common';
import { Space } from 'src/notes/entities/space.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpacesRepository extends Repository<Space> {
    createSpace(): Promise<Space | void> {
        return Promise.resolve();
    }
}
