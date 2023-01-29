import {BaseEntity} from 'src/common/entities/base.entity';
import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {Lead} from 'src/lead/entities/lead.entity';
import {Entity, UpdateDateColumn, ManyToOne, Column, Unique} from 'typeorm';

@Unique(['phone'])
@Entity('contact')
export class Contact extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@Column('varchar')
	phone: string;

	@Column('varchar')
	name: string;

	@ManyToOne(() => Lead, lead => lead.id, {nullable: true, onDelete: 'SET NULL'})
	lead: string | null;

	@ManyToOne(() => Dashboard, dashboard => dashboard.id, {onDelete: 'CASCADE'})
	dashboard: Dashboard;

	@Column('uuid')
	dashboardId: string;
}
