import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Space } from './space.entity';
import { Notebook } from './notebook.entity';

@Entity('stacks')
export class Stack {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'space_id' })
    spaceId: string;

    @ManyToOne(() => Space, (space) => space.stacks, { onDelete: 'CASCADE', eager: false })
    @JoinColumn({ name: 'space_id' })
    space: Space;

    @Column()
    name: string;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_at' })
    updatedAt: Date;

    @OneToMany(() => Notebook, (notebook) => notebook.stack, { cascade: true, eager: false })
    notebooks: Notebook[];
}
