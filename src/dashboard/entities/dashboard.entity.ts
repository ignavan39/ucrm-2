import {Pipeline} from 'src/pipeline/entities/pipeline.entity';
import {User} from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';

@Unique(['author', 'name'])
@Entity('dashboard')
export class Dashboard {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column('varchar')
	name!: string;

	@ManyToOne(() => User, {onDelete: 'CASCADE'})
	author!: User;

	@OneToMany(() => Pipeline, p => p.dashboard)
	pipelines: Pipeline[];
}
