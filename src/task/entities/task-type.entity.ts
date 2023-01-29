import {BaseEntity} from 'src/common/base.entity';
import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {Column, Entity, ManyToOne} from 'typeorm';

@Entity('task_type')
export class TaskType extends BaseEntity {
	@Column('varchar')
	text: string;

	@ManyToOne(() => Dashboard, dashboard => dashboard.id, {onDelete: 'CASCADE'})
	dashboard: Dashboard;
}
