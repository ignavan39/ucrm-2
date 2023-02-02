import {UseGuards, Controller, Post, Body, ForbiddenException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DashboardPermissionGuard} from 'src/dashboard/guards/dashboard-permission.guard';
import {JwtAuthGuard} from 'src/user/guards/jwt.guard';
import {Repository} from 'typeorm';
import {CreatePipelineDto} from './dto/create-pipeline.dto';
import {Pipeline} from './entities/pipeline.entity';

@UseGuards(JwtAuthGuard)
@Controller('pipeline')
export class PipelineController {
	constructor(@InjectRepository(Pipeline) private readonly repository: Repository<Pipeline>) {}

	@Post('/create')
	async create(@Body() args: CreatePipelineDto) {
		const permission = await this.repository
			.createQueryBuilder('p')
			.innerJoin('p.dashboard', 'd', 'd.id = p.dashboard_id')
			.innerJoin('d.pipelines', 'pp', 'pp.dashboard_id = d.id')
			.where('d.id =:id', {id: args.dashboardId})
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

		return this.repository.save({
			name: args.name,
			dashboard: {
				id: args.dashboardId,
			},
			order: lastOrder + 1,
		});
	}
}
