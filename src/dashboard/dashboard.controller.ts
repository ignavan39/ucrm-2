import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {IAM} from 'src/common/decorators';
import {User} from 'src/user/entities/user.entity';
import {JwtAuthGuard} from 'src/user/guards/jwt.guard';
import {Repository} from 'typeorm';
import {CreateDashboardDto, UpdateDashboardDto} from './dto/dashboard.dto';
import {AddPermissionDto} from './dto/permission.dto';
import {Dashboard} from './entities/dashboard.entity';
import {Permission, PermissionType} from './entities/permission.entity';
import {DashboardPermissionGuard} from './guards/dashboard-permission.guard';

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

	@Get('/')
	async getByUserId(@IAM('id') userId: string) {
		return this.repository
			.createQueryBuilder('d')
			.innerJoin('d.permissions', 'p', 'p.dashboard_id = d.id AND p.user_id =:userId', {userId})
			.getMany();
	}

	@UseGuards(DashboardPermissionGuard())
	@Get('/:id')
	async getById(@Param('id') id: string, @IAM('id') userId: string) {
		const dashboard = await this.repository.findOne({
			where: {
				id,
			},
			relations: ['pipelines', 'permissions', 'permissions.user', 'creator'],
		});

		return {
			...dashboard,
			creator: {
				email: dashboard.creator.email,
				avatarUrl: dashboard.creator.avatartUrl,
				name: dashboard.creator.name,
			},
			permissions: dashboard.permissions.map(p => ({
				type: p.type,
				user: {
					id: p.userId,
					name: p.user.name,
					email: p.user.email,
					avatarUrl: p.user.avatartUrl,
				},
			})),
		};
	}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Patch('/:id')
	async update(@Param('id') id: string, @Body() body: UpdateDashboardDto) {
		await this.repository.update(
			{
				id,
			},
			{
				name: body.name,
			},
		);
	}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Delete('/:id')
	async delete(@Param('id') id: string, @IAM('id') userId: string) {
		await this.repository.delete({
			id,
			creatorId: userId,
		});
	}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Delete('/:id/permission/:email')
	async deletePermission(@Param('id') id: string, @Param('email') email: string) {
		const user = await this.userRepository.findOne({
			where: {
				email,
			},
			relations: ['permissions'],
		});

		if (!user) {
			throw new BadRequestException('user not found');
		}

		const currentPermission = user.permissions.find(p => p.dashboardId === id);

		if (!currentPermission) {
			throw new BadRequestException('permission not found');
		}

		await this.permissionRepository.delete({
			id: currentPermission.id,
		});
	}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Post('/:id/permission/add')
	async addAccess(@Param('id') id: string, @IAM('id') userId: string, @Body() body: AddPermissionDto) {
		const user = await this.userRepository.findOne({
			where: {
				email: body.email,
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
