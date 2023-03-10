import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Dashboard } from '../../dashboard/entities/dashboard.entity';

@Entity('task_type')
export class TaskType extends BaseEntity {
	@Column('varchar')
	text: string;

	@ManyToOne(() => Dashboard, dashboard => dashboard.id, { onDelete: 'CASCADE' })
	dashboard: Dashboard;
}
