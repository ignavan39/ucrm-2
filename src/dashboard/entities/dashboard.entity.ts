import {BaseEntity} from 'src/common/entities/base.entity';
import {Pipeline} from 'src/pipeline/entities/pipeline.entity';
import {User} from 'src/user/entities/user.entity';
import {Column, Entity, ManyToOne, OneToMany, Unique, UpdateDateColumn} from 'typeorm';
import {Permission} from './permission.entity';

@Unique(['creator', 'name'])
@Entity('dashboard')
export class Dashboard extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@Column('varchar')
	name!: string;

	@ManyToOne(() => User, {onDelete: 'CASCADE'})
	creator!: User;

	@Column('uuid')
	creatorId: string;

	@OneToMany(() => Pipeline, p => p.dashboard)
	pipelines: Pipeline[];

	@OneToMany(() => Permission, permission => permission.dashboard)
	permissions: Permission[];
}
