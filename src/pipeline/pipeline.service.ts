import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../dashboard/entities/permission.entity';
import { isViolatedUniqueConstraintError } from '../common/utils/database-helpers';
import { Pipeline } from './entities/pipeline.entity';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { MovePipelineDto } from './dto/move-pipeline.dto';
import { PipelineAlreadyExist, PipelineNotFoundException, UnableToMovePipeline } from './pipeline.exceptions';

@Injectable()
export class PipelineService {
	constructor(
		@InjectRepository(Pipeline) private readonly pipelineRepository: Repository<Pipeline>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
	) {}

	async create(dto: CreatePipelineDto): Promise<Pipeline> {
		const pipelines = await this.pipelineRepository.find({
			where: {
				dashboardId: dto.dashboardId,
			},
			order: {
				order: 'DESC',
			},
		});
		const lastOrder = pipelines.length === 0 ? 0 : pipelines[0].order;
		try {
			return await this.pipelineRepository.save({
				name: dto.name,
				dashboardId: dto.dashboardId,
				order: lastOrder + 1,
			});
		} catch (e) {
			if (isViolatedUniqueConstraintError(e)) {
				throw new PipelineAlreadyExist();
			}
			throw e;
		}
	}

	async update(dto: UpdatePipelineDto, id: string): Promise<void> {
		await this.pipelineRepository.update(
			{
				id,
			},
			{
				name: dto.name,
			},
		);
	}

	async delete(id: string): Promise<void> {
		const pipeline = await this.pipelineRepository.findOne({
			where: {
				id,
			},
		});
		if (!pipeline) {
			throw new PipelineNotFoundException('pipeline not found');
		}

		await this.pipelineRepository.query(
			`
				UPDATE pipeline SET "order" = "order" - 1
				WHERE "order" > $1
				AND dashboard_id = $2
		`,
			[pipeline.order, pipeline.dashboardId],
		);

		await this.pipelineRepository.delete({
			id: pipeline.id,
		});
	}

	async move(dto: MovePipelineDto, id: string): Promise<void> {
		const pipeline = await this.pipelineRepository.findOne({
			where: {
				id,
			},
		});
		if (!pipeline) {
			throw new PipelineNotFoundException('pipeline not found');
		}

		let oldOrder = 0;

		if (dto.leftId) {
			const leftPipeline = await this.pipelineRepository.findOne({
				where: {
					id: dto.leftId,
				},
			});
			if (!leftPipeline) {
				throw new UnableToMovePipeline('unable to move pipeline');
			}

			oldOrder = leftPipeline.order;
		}

		if (oldOrder > pipeline.order) {
			await this.pipelineRepository.query(
				`UPDATE pipeline SET "order" = "order" - 1
					WHERE "order" > $1
						AND "order" <= $2
						AND dashboard_id = $2`,
				[pipeline.order, oldOrder, pipeline.dashboardId],
			);
			pipeline.order = oldOrder;
		} else {
			await this.pipelineRepository.query(
				`UPDATE pipeline SET "order" = "order" + 1
					WHERE "order" > $1
						AND "order" < $2
						AND dashboard_id = $2`,
				[oldOrder, pipeline.order, pipeline.dashboardId],
			);
			pipeline.order = oldOrder + 1;
		}
		await this.pipelineRepository.save(pipeline);
	}

	async getAllByDashboardId(dashboardId: string): Promise<Pipeline[]> {
		return this.pipelineRepository.find({
			where: {
				dashboardId,
			},
			order: {
				order: 'ASC',
			},
		});
	}
}
