import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export enum CustomFieldTypeEnum {
	Text = 'text',
	Select = 'select',
	DateTime = 'date_time',
}

@Entity('custom_field_lead')
export class CustomFieldLead {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({type: 'enum', enum: CustomFieldTypeEnum, enumName: 'custom_field_type_enum'})
	type: CustomFieldTypeEnum;

	@Column('varchar')
	name: string;
}
