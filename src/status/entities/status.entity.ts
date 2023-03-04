import { Column, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Pipeline } from '../../pipeline/entities/pipeline.entity';

@Entity('status')
export class Status extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Pipeline, p => p.id, { onDelete: 'CASCADE' })
	pipeline: Pipeline;

	@Column('uuid')
	pipelineId: string;

	@Column('varchar')
	name: string;

	@Column({ type: 'smallint', default: 1 })
	order!: number;
}
