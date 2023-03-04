import { Unique, Entity, UpdateDateColumn, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities';
import { Dashboard } from '../../dashboard/entities/dashboard.entity';
import { Lead } from '../../lead/entities/lead.entity';

@Unique(['phone'])
@Entity('contact')
export class Contact extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@Column('varchar')
	phone: string;

	@Column('varchar')
	name: string;

	@ManyToOne(() => Lead, lead => lead.id, { nullable: true, onDelete: 'SET NULL' })
	lead: string | null;

	@ManyToOne(() => Dashboard, dashboard => dashboard.id, { onDelete: 'CASCADE' })
	dashboard: Dashboard;

	@Column('uuid')
	dashboardId: string;
}
