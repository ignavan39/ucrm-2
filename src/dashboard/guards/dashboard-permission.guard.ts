import { CanActivate, ExecutionContext, mixin, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionType, Permission } from '../entities/permission.entity';

export const DashboardPermissionGuard = (type?: PermissionType) => {
	class DashboardPermissionGuardMixin implements CanActivate {
		constructor(@InjectRepository(Permission) readonly repository: Repository<Permission>) {}
		async canActivate(context: ExecutionContext) {
			const request = context.switchToHttp().getRequest();
			const { user } = request;
			if (!user) {
				throw new UnauthorizedException();
			}

			const dashboardId = request.params.id ?? request.params.dashboardId;
			const permission = await this.repository.findOne({
				where: {
					userId: user.id,
					dashboardId,
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
