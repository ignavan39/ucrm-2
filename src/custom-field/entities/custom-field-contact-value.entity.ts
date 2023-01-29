import {BaseEntity} from 'src/common/base.entity';
import {Contact} from 'src/contact/entities/contact.entity';
import {Unique, Entity, ManyToOne, Column} from 'typeorm';
import {CustomField} from './custom-field.entity';

@Unique(['contact', 'customField'])
@Entity('custom_field_contact_lead_value')
export class CustomFieldContactValue extends BaseEntity {
	@ManyToOne(() => Contact, contact => contact.id, {onDelete: 'CASCADE'})
	contact: Contact;

	@ManyToOne(() => CustomField, cf => cf.id, {onDelete: 'CASCADE'})
	customField: CustomField;

	@Column('text')
	value: string;
}
