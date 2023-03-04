import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { PermissionType } from '../entities/permission.entity';

export class AddPermissionDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@IsIn([PermissionType.Admin, PermissionType.Manager])
	type: PermissionType;
}
