import {
	UseGuards,
	Controller,
	Post,
	Body,
	ForbiddenException,
	Patch,
	Param,
	UnprocessableEntityException,
	Delete,
	BadRequestException,
	Get,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission, PermissionType } from '../dashboard/entities/permission.entity';
import { DashboardPermissionGuard } from '../dashboard/guards/dashboard-permission.guard';
import { JwtAuthGuard } from '../user/guards/jwt.guard';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { MovePipelineDto } from './dto/move-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { Pipeline } from './entities/pipeline.entity';
import { PipelinePermissionGuard } from './guards/pipeline-permission.guard';

@UseGuards(JwtAuthGuard)
@Controller('pipeline')
export class PipelineController {
	constructor(
		@InjectRepository(Pipeline) private readonly repository: Repository<Pipeline>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
	) {}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Post('/create')
	async create(@Body() args: CreatePipelineDto) {
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

	@UseGuards(PipelinePermissionGuard(PermissionType.Admin))
	@Patch('/:id')
	public async update(@Body() args: UpdatePipelineDto, @Param('id') id: string) {
		await this.repository.update(
			{
				id,
			},
			{
				name: args.name,
			},
		);
	}

	@UseGuards(PipelinePermissionGuard(PermissionType.Admin))
	@Delete('/:id')
	public async delete(@Param('id') id: string) {
		const pipeline = await this.repository.findOne({
			where: {
				id,
			},
		});
		if (!pipeline) {
			throw new ForbiddenException();
		}

		await this.repository.query(
			`
				UPDATE pipeline SET "order" = "order" - 1
				WHERE "order" > $1
				AND dashboard_id = $2
		`,
			[pipeline.order, pipeline.dashboardId],
		);

		await this.repository.delete({
			id: pipeline.id,
		});
	}

	@UseGuards(PipelinePermissionGuard(PermissionType.Admin))
	@Patch('/move/:id')
	public async move(@Body() args: MovePipelineDto, @Param('id') id: string) {
		const pipeline = await this.repository.findOne({
			where: {
				id,
			},
		});
		if (!pipeline) {
			throw new ForbiddenException();
		}

		let oldOrder = 0;

		if (args.leftId) {
			const leftTemplate = await this.repository.findOne({
				where: {
					id: args.leftId,
				},
			});
			if (!leftTemplate) {
				throw new BadRequestException('pipeline not found');
			}

			oldOrder = leftTemplate.order;
		}

		if (oldOrder > pipeline.order) {
			await this.repository.query(
				`UPDATE pipeline SET "order" = "order" - 1
					WHERE "order" > $1
						AND "order" <= $2
						AND dashboard_id = $2`,
				[pipeline.order, oldOrder, pipeline.dashboardId],
			);
			pipeline.order = oldOrder;
		} else {
			await this.repository.query(
				`UPDATE pipeline SET "order" = "order" + 1
					WHERE "order" > $1
						AND "order" < $2
						AND dashboard_id = $2`,
				[oldOrder, pipeline.order, pipeline.dashboardId],
			);
			pipeline.order = oldOrder + 1;
		}
		await this.repository.save(pipeline);
	}

	@UseGuards(DashboardPermissionGuard())
	@Get('/:dashboardId')
	public async getAllByDashboardId(@Param('dashboardId') dashboardId: string) {
		return this.repository.find({
			where: {
				dashboardId,
			},
			order: {
				order: 'ASC',
			},
		});
	}
}
