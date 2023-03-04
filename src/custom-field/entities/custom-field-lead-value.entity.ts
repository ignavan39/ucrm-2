import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Lead } from '../../lead/entities/lead.entity';
import { CustomField } from './custom-field.entity';

@Unique(['lead', 'customField'])
@Entity('custom_field_lead_value')
export class CustomFieldLeadValue extends BaseEntity {
	@ManyToOne(() => Lead, lead => lead.id, { onDelete: 'CASCADE' })
	lead: Lead;

	@ManyToOne(() => CustomField, cf => cf.id, { onDelete: 'CASCADE' })
	customField: CustomField;

	@Column('text')
	value: string;
}
