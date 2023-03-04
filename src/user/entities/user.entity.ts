import { Check, Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities';
import { Dashboard } from '../../dashboard/entities/dashboard.entity';
import { Permission } from '../../dashboard/entities/permission.entity';

@Unique(['email'])
@Check('(char_length(password) >= 5)')
@Entity('user')
export class User extends BaseEntity {
	@Column('varchar')
	name!: string;

	@Column({ type: 'text', select: false })
	password!: string;

	@Column('varchar')
	email!: string;

	@Column({ type: 'text', nullable: true })
	avatarUrl!: string | null;

	@OneToMany(() => Dashboard, d => d.creator)
	dashboards!: Dashboard[];

	@OneToMany(() => Permission, permission => permission.user)
	permissions: Permission[];
}
