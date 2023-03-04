import { Unique, Entity, UpdateDateColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities';
import { Pipeline } from '../../pipeline/entities/pipeline.entity';
import { User } from '../../user/entities/user.entity';
import { Permission } from './permission.entity';

@Unique(['creator', 'name'])
@Entity('dashboard')
export class Dashboard extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@Column('varchar')
	name!: string;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	creator!: User;

	@Column('uuid')
	creatorId: string;

	@OneToMany(() => Pipeline, p => p.dashboard)
	pipelines: Pipeline[];

	@OneToMany(() => Permission, permission => permission.dashboard)
	permissions: Permission[];
}
