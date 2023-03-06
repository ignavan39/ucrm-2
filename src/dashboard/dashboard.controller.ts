import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IAM } from '../common/decorators';
import { JwtAuthGuard } from '../user/guards/jwt.guard';
import {
	DashboardAlreadyExistException,
	PermissionAlreadyExistException,
	PermissionNotFoundException,
} from './dashboard.exceptions';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto, UpdateDashboardDto } from './dto/dashboard.dto';
import { AddPermissionDto } from './dto/permission.dto';
import { Dashboard } from './entities/dashboard.entity';
import { Permission, PermissionType } from './entities/permission.entity';
import { DashboardPermissionGuard } from './guards/dashboard-permission.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
	constructor(@Inject(DashboardService) private readonly dashboardService: DashboardService) {}

	@Post('/create')
	async create(@Body() body: CreateDashboardDto, @IAM('id') userId: string) {
		try {
			const dashboard = await this.dashboardService.create(body.name, userId);

			return dashboard;
		} catch (e) {
			if (e instanceof DashboardAlreadyExistException) {
				throw new BadRequestException(e.message);
			}
			throw e;
		}
	}

	@Get('/')
	async getByUserId(@IAM('id') userId: string): Promise<Dashboard[]> {
		return this.dashboardService.getByUserId(userId);
	}

	@UseGuards(DashboardPermissionGuard())
	@Get('/:id')
	async getById(@Param('id') id: string, @IAM('id') userId: string) {
		return this.dashboardService.getById(id);
	}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Patch('/:id')
	async update(@Param('id') id: string, @Body() body: UpdateDashboardDto): Promise<void> {
		await this.dashboardService.update(id, body.name);
	}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Delete('/:id')
	async delete(@Param('id') id: string, @IAM('id') userId: string): Promise<void> {
		await this.dashboardService.delete(id, userId);
	}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Delete('/:id/permission/:email')
	async deletePermission(@Param('id') id: string, @Param('email') email: string): Promise<void> {
		try {
			await this.dashboardService.deletePermission(id, email);
		} catch (e) {
			if (e instanceof PermissionNotFoundException) {
				throw new BadRequestException(e.message);
			}
			throw e;
		}
	}

	@UseGuards(DashboardPermissionGuard(PermissionType.Admin))
	@Post('/:id/permission/add')
	async addAccess(@Param('id') id: string, @IAM('id') userId: string, @Body() body: AddPermissionDto): Promise<void> {
		try {
			await this.dashboardService.addAccess(id, userId, body);
		} catch (e) {
			if (e instanceof PermissionNotFoundException) {
				throw new BadRequestException(e.message);
			}
			if (e instanceof PermissionAlreadyExistException) {
				throw new BadRequestException(e.message);
			}
			throw e;
		}
	}
}
