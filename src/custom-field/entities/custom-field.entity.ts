import {BaseEntity} from 'src/common/entities/base.entity';
import {EntityTypeEnum} from 'src/common/entities/entity-type.enum';
import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {Column, Entity, ManyToOne, UpdateDateColumn} from 'typeorm';

export enum CustomFieldTypeEnum {
	Text = 'text',
	Select = 'select',
	DateTime = 'date_time',
}

@Entity('custom_field')
export class CustomField extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@Column({type: 'enum', enum: CustomFieldTypeEnum, enumName: 'custom_field_type_enum'})
	type: CustomFieldTypeEnum;

	@Column({type: 'enum', enum: EntityTypeEnum, enumName: 'custom_field_entity_type_enum'})
	entityType: EntityTypeEnum;

	@ManyToOne(() => Dashboard, dashboard => dashboard.id, {onDelete: 'CASCADE'})
	dashboard: Dashboard;

	@Column('uuid')
	dashboardId: string;

	@Column('varchar')
	name: string;
}
