import {BaseEntity} from 'src/common/entities/base.entity';
import {Lead} from 'src/lead/entities/lead.entity';
import {User} from 'src/user/entities/user.entity';
import {Check, Column, Entity, ManyToOne} from 'typeorm';
import {TaskType} from './task-type.entity';

@Check('(completed_at is null and result is null) OR (completed_at is not null and result is not null)')
@Entity('task')
export class Task extends BaseEntity {
	@Column('text')
	text: string;

	// if null - task on all day
	@Column({type: 'timestamp', nullable: true})
	completeTill: Date;

	@Column({type: 'timestamp', nullable: true})
	completedAt: Date;

	@ManyToOne(() => User, user => user.id, {onDelete: 'CASCADE'})
	responsible: User;

	@ManyToOne(() => TaskType, type => type.id, {onDelete: 'CASCADE'})
	type: TaskType;

	@ManyToOne(() => Lead, lead => lead.id, {onDelete: 'CASCADE'})
	lead: Lead;

	@Column({type: 'text', nullable: true})
	result: string;
}
