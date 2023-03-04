import { CanActivate, ExecutionContext, mixin, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionType, Permission } from '../../dashboard/entities/permission.entity';

export const PipelinePermissionGuard = (type?: PermissionType) => {
	class PipelinePermissionGuardMixin implements CanActivate {
		constructor(@InjectRepository(Permission) readonly repository: Repository<Permission>) {}
		async canActivate(context: ExecutionContext) {
			const request = context.switchToHttp().getRequest();
			const { user } = request;
			if (!user) {
				throw new UnauthorizedException();
			}

			const pipelineId = request.params.id as number;

			const permission = await this.repository
				.createQueryBuilder('p')
				.innerJoin('p.dashboard', 'd', 'd.id = p.dashboard_id')
				.innerJoin('d.pipelines', 'pp', 'pp.dashboard_id = d.id')
				.where('pp.id =:id', { id: pipelineId })
				.andWhere('p.user_id =:userId', { userId: user.id })
				.getOne();
			if (!permission) {
				return false;
			}

			return type !== undefined ? permission.type === type : true;
		}
	}

	const guard = mixin(PipelinePermissionGuardMixin);
	return guard;
};
