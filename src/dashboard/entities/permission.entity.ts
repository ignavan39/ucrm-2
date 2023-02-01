import {BaseEntity} from 'src/common/entities';
import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {User} from 'src/user/entities/user.entity';
import {Column, Entity, ManyToOne, Unique} from 'typeorm';

export enum PermissionType {
	Admin = 'admin',
	Manager = 'manager',
}

@Unique(['dashboard', 'user'])
@Entity('permission')
export class Permission extends BaseEntity {
	@Column({type: 'enum', enumName: 'permission_type_enum', enum: PermissionType})
	type: PermissionType;

	@Column('uuid')
	dashboardId: string;

	@ManyToOne(() => Dashboard, dashboard => dashboard.id, {onDelete: 'CASCADE'})
	dashboard: Dashboard;

	@Column('uuid')
	userId: string;

	@ManyToOne(() => User, user => user.id, {onDelete: 'CASCADE'})
	user: User;

	@ManyToOne(() => User, user => user.id, {onDelete: 'SET NULL'})
	issuer: User;
}
