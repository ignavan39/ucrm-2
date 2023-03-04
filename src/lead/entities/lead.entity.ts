import { Entity, UpdateDateColumn, OneToMany, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities';
import { CustomFieldLeadValue } from '../../custom-field/entities/custom-field-lead-value.entity';
import { Status } from '../../status/entities/status.entity';

@Entity('lead')
export class Lead extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Status, status => status.id)
	status: Status;

	@Column('varchar')
	name: string;

	@Column('uuid')
	statusId: string;

	@OneToMany(() => CustomFieldLeadValue, customFields => customFields.lead)
	customFiledValues: CustomFieldLeadValue[];
}
