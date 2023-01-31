import {IsIn, IsNotEmpty, IsUUID} from 'class-validator';
import {PermissionType} from '../entities/permission.entity';

export class AddPermissionDto {
	@IsUUID()
	@IsNotEmpty()
	userId: string;

	@IsNotEmpty()
	@IsIn([PermissionType.Admin, PermissionType.Manager])
	type: PermissionType;
}
