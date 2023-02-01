import {CanActivate, ExecutionContext, mixin, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PermissionType, Permission} from '../entities/permission.entity';

export const DashboardPermissionGuard = (type?: PermissionType) => {
	class DashboardPermissionGuardMixin implements CanActivate {
		constructor(@InjectRepository(Permission) readonly repository: Repository<Permission>) {}
		async canActivate(context: ExecutionContext) {
			const {user} = context.switchToHttp().getRequest();
			if (!user) {
				throw new UnauthorizedException();
			}

			const permission = await this.repository.findOne({
				where: {
					userId: user.id,
				},
			});
			if (!permission) {
				return false;
			}

			return type !== undefined ? permission.type === type : true;
		}
	}

	const guard = mixin(DashboardPermissionGuardMixin);
	return guard;
};
