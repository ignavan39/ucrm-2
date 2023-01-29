import {BaseEntity} from 'src/common/entities/base.entity';
import {Pipeline} from 'src/pipeline/entities/pipeline.entity';
import {Column, Entity, ManyToOne, UpdateDateColumn} from 'typeorm';

@Entity('status')
export class Status extends BaseEntity {
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
