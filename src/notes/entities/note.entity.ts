import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Notebook } from './notebook.entity';

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'notebook_id' })
    notebookId: string;

    @ManyToOne(() => Notebook, (notebook) => notebook.notes, { onDelete: 'CASCADE', eager: false })
    @JoinColumn({ name: 'notebook_id' })
    notebook: Notebook;

    @Column()
    title: string;

    @Column({ default: '' })
    content: string;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_at' })
    updatedAt: Date;
}
