import {BaseEntity} from 'src/common/entities/base.entity';
import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {Permission} from 'src/dashboard/entities/permission.entity';
import {Check, Column, Entity, OneToMany, Unique} from 'typeorm';

@Unique(['email'])
@Check('(char_length(password) >= 5)')
@Entity('user')
export class User extends BaseEntity {
	@Column('varchar')
	name!: string;

	@Column('text')
	password!: string;

	@Column('varchar')
	email!: string;

	@Column({type: 'text', nullable: true})
	avatartUrl!: string | null;

	@OneToMany(() => Dashboard, d => d.creator)
	dashboards!: Dashboard[];

	@OneToMany(() => Permission, permission => permission.user)
	permissions: Permission[];
}
