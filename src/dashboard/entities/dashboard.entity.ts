import {BaseEntity} from 'src/common/base.entity';
import {Pipeline} from 'src/pipeline/entities/pipeline.entity';
import {User} from 'src/user/entities/user.entity';
import {Column, Entity, ManyToOne, OneToMany, Unique, UpdateDateColumn} from 'typeorm';

@Unique(['creator', 'name'])
@Entity('dashboard')
export class Dashboard extends BaseEntity {
	@UpdateDateColumn()
	updatedAt: Date;

	@Column('varchar')
	name!: string;

	@ManyToOne(() => User, {onDelete: 'CASCADE'})
	creator!: User;

	@OneToMany(() => Pipeline, p => p.dashboard)
	pipelines: Pipeline[];
}
