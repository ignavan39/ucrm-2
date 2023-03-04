import * as crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { isViolatedUniqueConstraintError } from '../common/utils/database-helpers';
import { SignInDto, AuthCommonResponse, SignUpDto } from './dto';
import { User } from './entities/user.entity';
import { UserAlreadyExistException, UserNotFoundException } from './user.exceptions';

@Injectable()
export class UserService {
	constructor(
		private readonly authService: AuthService,
		@InjectRepository(User) private readonly repository: Repository<User>,
	) {}

	async signIn(payload: SignInDto): Promise<AuthCommonResponse> {
		const password = crypto.createHmac('sha256', payload.password).digest('hex');
		const user = await this.repository.findOne({
			where: {
				password: password,
				email: payload.email,
			},
		});
		if (!user) {
			throw new UserNotFoundException("user doesn't exist");
		}
		const token = await this.authService.createJwtToken(user.id);
		return {
			user,
			token,
		};
	}
	async signUp(payload: SignUpDto): Promise<AuthCommonResponse> {
		const password = crypto.createHmac('sha256', payload.password).digest('hex');

		try {
			const user = await this.repository.save({
				password,
				email: payload.email,
				name: payload.name,
				avatarUrl: payload.avatarUrl,
			});
			const token = await this.authService.createJwtToken(user.id);
			return {
				user: _.omit(user, 'password'),
				token,
			};
		} catch (e) {
			if (isViolatedUniqueConstraintError(e)) {
				throw new UserAlreadyExistException('user with this email already exist');
			}
			throw e;
		}
	}
	async getCurrent(userId: string): Promise<User> {
		return this.repository.findOne({
			where: {
				id: userId,
			},
		});
	}
}
