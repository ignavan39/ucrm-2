import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {Check, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Unique(['email'])
@Check('(char_length(password) >= 5)')
@Entity('user')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column('varchar')
	name!: string;

	@Column('text')
	password!: string;

	@Column('varchar')
	email!: string;

	@Column({type: 'text', nullable: true})
	avatartUrl!: string | null;

	@OneToMany(() => Dashboard, d => d.author)
	dashboards!: Dashboard[];
}
