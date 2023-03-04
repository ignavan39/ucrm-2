import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Dashboard } from '../../dashboard/entities/dashboard.entity';

@Entity('tag')
export class Tag extends BaseEntity {
	@Column('varchar')
	name: string;

	@ManyToOne(() => Dashboard, dashboard => dashboard.id, { onDelete: 'CASCADE' })
	dashboard: Dashboard;

	@Column('uuid')
	dashboardId: string;
}
