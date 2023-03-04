import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isViolatedUniqueConstraintError } from '../common/utils/database-helpers';
import { User } from '../user/entities/user.entity';
import {
	DashboardAlreadyExistException,
	PermissionAlreadyExistException,
	PermissionNotFoundException,
} from './dashboard.exceptions';
import { AddPermissionDto } from './dto/permission.dto';
import { Dashboard } from './entities/dashboard.entity';
import { Permission, PermissionType } from './entities/permission.entity';

@Injectable()
export class DashboardService {
	constructor(
		@InjectRepository(Dashboard) private readonly repository: Repository<Dashboard>,
		@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	async create(name: string, userId: string) {
		try {
			const dashboard = await this.repository.save({
				name: name,
				creatorId: userId,
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
			if (isViolatedUniqueConstraintError(e)) {
				throw new DashboardAlreadyExistException('dashboard with this name already exist');
			}
			throw e;
		}
	}

	async getByUserId(userId: string): Promise<Dashboard[]> {
		return this.repository
			.createQueryBuilder('d')
			.innerJoin('d.permissions', 'p', 'p.dashboard_id = d.id AND p.user_id =:userId', { userId })
			.getMany();
	}

	async getById(id: string) {
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
				avatarUrl: dashboard.creator.avatarUrl,
				name: dashboard.creator.name,
			},
			permissions: dashboard.permissions.map(p => ({
				type: p.type,
				user: {
					id: p.userId,
					name: p.user.name,
					email: p.user.email,
					avatarUrl: p.user.avatarUrl,
				},
			})),
		};
	}

	async update(id: string, name: string): Promise<void> {
		await this.repository.update(
			{
				id,
			},
			{
				name,
			},
		);
	}

	async delete(id: string, userId: string): Promise<void> {
		await this.repository.delete({
			id,
			creatorId: userId,
		});
	}

	async deletePermission(id: string, email: string): Promise<void> {
		const user = await this.userRepository.findOne({
			where: {
				email,
			},
			relations: ['permissions'],
		});

		if (!user) {
			throw new PermissionNotFoundException('user not found');
		}

		const currentPermission = user.permissions.find(p => p.dashboardId === id);

		if (!currentPermission) {
			throw new PermissionNotFoundException('permission not found');
		}

		await this.permissionRepository.delete({
			id: currentPermission.id,
		});
	}

	async addAccess(id: string, userId: string, body: AddPermissionDto): Promise<void> {
		const user = await this.userRepository.findOne({
			where: {
				email: body.email,
			},
			relations: ['permissions'],
		});

		if (!user) {
			throw new PermissionNotFoundException('user not found');
		}

		const currentPermission = user.permissions.find(p => p.dashboardId === id);

		if (currentPermission) {
			throw new PermissionAlreadyExistException('permission already exist');
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
