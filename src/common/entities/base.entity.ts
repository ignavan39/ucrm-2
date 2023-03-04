import { PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt: Date;
}
