import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Stack } from './stack.entity';
import { Notebook } from './notebook.entity';

@Entity('spaces')
export class Space {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column()
    name: string;

    @Column({ default: '' })
    description: string;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_at' })
    updatedAt: Date;

    @OneToMany(() => Stack, (stack) => stack.space, { cascade: true, eager: false })
    stacks: Stack[];

    @OneToMany(() => Notebook, (notebook) => notebook.space, { cascade: true, eager: false })
    notebooks: Notebook[];
}
