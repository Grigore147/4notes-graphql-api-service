import { instanceToPlain } from 'class-transformer';

export class Entity {
    set(data: any) {
        Object.assign(this, instanceToPlain(data, { exposeUnsetFields: false }));

        return this;
    }
}
