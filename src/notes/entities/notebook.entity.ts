import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Stack } from './stack.entity';
import { Note } from './note.entity';
import { Space } from './space.entity';

@Entity('notebooks')
export class Notebook {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'space_id' })
    spaceId: string;

    @ManyToOne(() => Space, (space) => space.notebooks, { onDelete: 'CASCADE', eager: false })
    @JoinColumn({ name: 'space_id' })
    space: Space;

    @Column({ name: 'stack_id' })
    stackId: string;

    @ManyToOne(() => Stack, (stack) => stack.notebooks, { onDelete: 'CASCADE', eager: false })
    @JoinColumn({ name: 'stack_id' })
    stack: Stack;

    @Column()
    name: string;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_at' })
    updatedAt: Date;

    @OneToMany(() => Note, (note) => note.notebook, { cascade: true, eager: false })
    notes: Note[];
}
