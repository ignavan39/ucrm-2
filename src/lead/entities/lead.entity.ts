import {BaseEntity} from 'src/common/entities/base.entity';
import {CustomFieldLeadValue} from 'src/custom-field/entities/custom-field-lead-value.entity';
import {Status} from 'src/status/entities/status.entity';
import {Column, Entity, OneToMany, UpdateDateColumn} from 'typeorm';

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

	@OneToMany(() => CustomFieldLeadValue, cflv => cflv.lead)
	customFiledValues: CustomFieldLeadValue[];
}
