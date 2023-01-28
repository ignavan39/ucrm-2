import {Pipeline} from 'src/pipeline/entities/pipeline.entity';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('status')
export class Status {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Pipeline, p => p.id, {onDelete: 'CASCADE'})
	pipeline: Pipeline;

	@Column('uuid')
	pipelineId: string;

	@Column('varchar')
	name: string;

	@Column({type: 'smallint', default: 1})
	order!: number;
}
