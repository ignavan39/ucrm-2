import {BaseEntity} from 'src/common/base.entity';
import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {Column, Entity, ManyToOne} from 'typeorm';

@Entity('tag')
export class Tag extends BaseEntity {
	@Column('varchar')
	name: string;

	@ManyToOne(() => Dashboard, dashboard => dashboard.id, {onDelete: 'CASCADE'})
	dashboard: Dashboard;

	@Column('uuid')
	dashboardId: string;
}
