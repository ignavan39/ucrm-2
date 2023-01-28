import {Lead} from 'src/lead/entities/lead.entity';
import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Column, Unique} from 'typeorm';

@Unique(['phone'])
@Entity('contact')
export class Contact {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column('varchar')
	phone: string;

	@Column('varchar')
	name: string;

	@ManyToOne(() => Lead, lead => lead.id, {nullable: true, onDelete: 'SET NULL'})
	lead: string | null;
}
