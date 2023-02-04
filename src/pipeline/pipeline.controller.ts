import {UseGuards, Controller, Post, Body, ForbiddenException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Permission, PermissionType} from 'src/dashboard/entities/permission.entity';
import {JwtAuthGuard} from 'src/user/guards/jwt.guard';
import {Repository} from 'typeorm';
import {CreatePipelineDto} from './dto/create-pipeline.dto';
import {Pipeline} from './entities/pipeline.entity';

@UseGuards(JwtAuthGuard)
@Controller('pipeline')
export class PipelineController {
	constructor(
		@InjectRepository(Pipeline) private readonly repository: Repository<Pipeline>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
	) {}

	@Post('/create')
	async create(@Body() args: CreatePipelineDto) {
		const permission = await this.permissionRepository
			.createQueryBuilder('p')
			.innerJoin('p.dashboard', 'd', 'd.id = p.dashboard_id')
			.where('d.id =:id', {id: args.dashboardId})
			.andWhere('p.type =:type', {type: PermissionType.Admin})
			.getOne();

		if (!permission) {
			throw new ForbiddenException();
		}

		const pipelines = await this.repository.find({
			where: {
				dashboardId: args.dashboardId,
			},
			order: {
				order: 'DESC',
			},
		});
		const lastOrder = pipelines.length === 0 ? 0 : pipelines[0].order;
		try {
			return await this.repository.save({
				name: args.name,
				dashboardId: args.dashboardId,
				order: lastOrder + 1,
			});
		} catch (e) {
			if ('detail' in e && e.detail.includes('already exists')) {
				throw new ForbiddenException('pipeline with this name already exist');
			}
		}
	}
}
