import {CustomFieldLeadValue} from 'src/custom-field/entities/custom-field-lead-value.entity';
import {Status} from 'src/status/entities/status.entity';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('lead')
export class Lead {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Status, status => status.id)
	status: Status;

	@Column('varchar')
	name: string;

	@Column('uuid')
	statusId: string;

	@OneToMany(() => CustomFieldLeadValue, cflv => cflv.lead)
	customFiledValues: CustomFieldLeadValue[];
}
