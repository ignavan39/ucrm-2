import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {IAM} from 'src/common/decorators';
import {JwtAuthGuard} from 'src/user/guards/jwt.guard';
import {Repository} from 'typeorm';
import {CreateDashboardDto, UpdateDashboardDto} from './dto/dashboard.dto';
import {Dashboard} from './entities/dashboard.entity';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
	constructor(@InjectRepository(Dashboard) private readonly repository: Repository<Dashboard>) {}

	@Post('/create')
	async create(@Body() body: CreateDashboardDto, @IAM('id') userId: string) {
		try {
			return await this.repository.save({
				name: body.name,
				creator: {
					id: userId,
				},
			});
		} catch (e) {
			if ('detail' in e && e.detail.includes('already exists')) {
				throw new BadRequestException('dashboard with this name already exist');
			}
			throw e;
		}
	}

	@Get('/')
	async getByUserId(@IAM('id') userId: string) {
		return this.repository.find({
			where: {
				creatorId: userId,
			},
		});
	}

	@Get('/:id')
	async getById(@Param('id') id: string, @IAM('id') userId: string) {
		return this.repository.find({
			where: {
				creatorId: userId,
				id,
			},
		});
	}

	@Patch('/:id')
	async update(@Param('id') id: string, @IAM('id') userId: string, @Body() body: UpdateDashboardDto) {
		await this.repository.update(
			{
				id,
				creatorId: userId,
			},
			{
				name: body.name,
			},
		);
	}

	@Delete('/:id')
	async delete(@Param('id') id: string, @IAM('id') userId: string) {
		await this.repository.delete({
			id,
			creatorId: userId,
		});
	}
}
