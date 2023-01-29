import {BaseEntity} from 'src/common/entities/base.entity';
import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {Column, Entity, ManyToOne, UpdateDateColumn} from 'typeorm';

@Entity('pipeline')
export class Pipeline extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Dashboard, {onDelete: 'CASCADE'})
	dashboard!: Dashboard;

	@Column('uuid')
	dashboardId: string;

	@Column({type: 'smallint', default: 1})
	order!: number;
}
