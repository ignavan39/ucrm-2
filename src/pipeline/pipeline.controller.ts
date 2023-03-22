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
	Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isViolatedUniqueConstraintError } from 'src/common/utils/database-helpers';
import { Permission, PermissionType } from '../dashboard/entities/permission.entity';
import { DashboardPermissionGuard } from '../dashboard/guards/dashboard-permission.guard';
import { JwtAuthGuard } from '../user/guards/jwt.guard';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { MovePipelineDto } from './dto/move-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { Pipeline } from './entities/pipeline.entity';
import { PipelinePermissionGuard } from './guards/pipeline-permission.guard';
import { PipelineService } from './pipeline.service';
import { PipelineAlreadyExist, PipelineNotFoundException, UnableToMovePipeline } from './pipeline.exceptions';

@UseGuards(JwtAuthGuard)
@Controller('pipeline')
export class PipelineController {
	constructor(@Inject(PipelineService) private readonly pipelineService: PipelineService) {}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Post('/create')
	async create(@Body() args: CreatePipelineDto) {
		try {
			return this.pipelineService.create(args);
		} catch (e) {
			if (e instanceof PipelineAlreadyExist) {
				throw new ForbiddenException('pipeline with this name already exist');
			}
		}
	}

	@UseGuards(PipelinePermissionGuard(PermissionType.Admin))
	@Patch('/:id')
	public async update(@Body() args: UpdatePipelineDto, @Param('id') id: string) {
		await this.pipelineService.update(args, id);
	}

	@UseGuards(PipelinePermissionGuard(PermissionType.Admin))
	@Delete('/:id')
	public async delete(@Param('id') id: string) {
		try {
			await this.pipelineService.delete(id);
		} catch (e) {
			if (e instanceof PipelineNotFoundException) {
				throw new ForbiddenException(e.message);
			}
		}
	}

	@UseGuards(PipelinePermissionGuard(PermissionType.Admin))
	@Patch('/move/:id')
	public async move(@Body() args: MovePipelineDto, @Param('id') id: string) {
		try {
			await this.pipelineService.move(args, id);
		} catch (e) {
			if (e instanceof PipelineNotFoundException) {
				throw new ForbiddenException(e.message);
			}
			if (e instanceof UnableToMovePipeline) {
				throw new BadRequestException(e.message);
			}
		}
	}

	@UseGuards(DashboardPermissionGuard())
	@Get('/:dashboardId')
	public async getAllByDashboardId(@Param('dashboardId') dashboardId: string) {
		return this.pipelineService.getAllByDashboardId(dashboardId);
	}
}
