import {Lead} from 'src/lead/entities/lead.entity';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {CustomFieldLead} from './custom-field-lead.entity';

@Unique(['lead', 'customField'])
@Entity('custom_field_lead_value')
export class CustomFieldLeadValue {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => Lead, lead => lead.id, {onDelete: 'CASCADE'})
	lead: Lead;

	@ManyToOne(() => CustomFieldLead, cfl => cfl.id, {onDelete: 'CASCADE'})
	customField: CustomFieldLead;

	@Column('text')
	value: string;
}
