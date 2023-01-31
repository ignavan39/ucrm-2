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
import {User} from 'src/user/entities/user.entity';
import {JwtAuthGuard} from 'src/user/guards/jwt.guard';
import {Repository} from 'typeorm';
import {CreateDashboardDto, UpdateDashboardDto} from './dto/dashboard.dto';
import {AddPermissionDto} from './dto/permission.dto';
import {Dashboard} from './entities/dashboard.entity';
import {Permission, PermissionType} from './entities/permission.entity';
import {PermissionDashboardGuard} from './guards/dashboard-permission.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
	constructor(
		@InjectRepository(Dashboard) private readonly repository: Repository<Dashboard>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	@Post('/create')
	async create(@Body() body: CreateDashboardDto, @IAM('id') userId: string) {
		try {
			const dashboard = await this.repository.save({
				name: body.name,
				creator: {
					id: userId,
				},
			});

			await this.permissionRepository.insert({
				user: {
					id: userId,
				},
				issuer: {
					id: userId,
				},
				dashboard: {
					id: dashboard.id,
				},
				type: PermissionType.Admin,
			});

			return dashboard;
		} catch (e) {
			if ('detail' in e && e.detail.includes('already exists')) {
				throw new BadRequestException('dashboard with this name already exist');
			}
			throw e;
		}
	}

	@UseGuards(PermissionDashboardGuard())
	@Get('/')
	async getByUserId(@IAM('id') userId: string) {
		return this.repository.find({
			where: {
				creatorId: userId,
			},
		});
	}

	@UseGuards(PermissionDashboardGuard())
	@Get('/:id')
	async getById(@Param('id') id: string, @IAM('id') userId: string) {
		return this.repository.find({
			where: {
				creatorId: userId,
				id,
			},
		});
	}

	@UseGuards(PermissionDashboardGuard(PermissionType.Admin))
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

	@UseGuards(PermissionDashboardGuard(PermissionType.Admin))
	@Delete('/:id')
	async delete(@Param('id') id: string, @IAM('id') userId: string) {
		await this.repository.delete({
			id,
			creatorId: userId,
		});
	}

	@UseGuards(PermissionDashboardGuard(PermissionType.Admin))
	@Post('/:id/permission/add')
	async addAccess(@Param('id') id: string, @IAM('id') userId: string, @Body() body: AddPermissionDto) {
		const user = await this.userRepository.findOne({
			where: {
				id: userId,
			},
			relations: ['permissions'],
		});

		if (!user) {
			throw new BadRequestException('user not found');
		}

		const currentPermission = user.permissions.find(p => p.dashboardId === id);

		if (currentPermission) {
			throw new BadRequestException('permission already exist');
		}

		await this.permissionRepository.insert({
			user,
			issuer: {
				id: userId,
			},
			dashboard: {
				id,
			},
			type: body.type,
		});
	}
}
