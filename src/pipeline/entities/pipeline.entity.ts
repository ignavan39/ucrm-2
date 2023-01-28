import { Dashboard } from 'src/dashboard/entities/dashboard.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('pipeline')
export class Pipeline {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => Dashboard, { onDelete: 'CASCADE' })
	dashboard!: Dashboard;

	@Column({ type: 'smallint', default: 1 })
	order!: number;
}
