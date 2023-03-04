import * as crypto from 'node:crypto';
import { Body, Controller, ForbiddenException, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { IAM } from '../common/decorators';
import { isViolatedUniqueConstraintError } from '../common/utils/database-helpers';
import { SignInDto, AuthCommonResponse, SignUpDto } from './dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
	constructor(
		private readonly authService: AuthService,
		@InjectRepository(User) private readonly repository: Repository<User>,
	) {}

	@Post('/signIn')
	async signIn(@Body() body: SignInDto): Promise<AuthCommonResponse> {
		const password = crypto.createHmac('sha256', body.password).digest('hex');
		const user = await this.repository.findOne({
			where: {
				password: password,
				email: body.email,
			},
		});
		if (!user) {
			throw new NotFoundException("user doesn't exist");
		}
		const token = await this.authService.createJwtToken(user.id);
		return {
			user,
			token,
		};
	}

	@Post('/signUp')
	async signUp(@Body() body: SignUpDto): Promise<AuthCommonResponse> {
		const password = crypto.createHmac('sha256', body.password).digest('hex');

		try {
			const user = await this.repository.save({
				password,
				email: body.email,
				name: body.name,
				avatarUrl: body.avatarUrl,
			});
			const token = await this.authService.createJwtToken(user.id);
			return {
				user: _.omit(user, 'password'),
				token,
			};
		} catch (e) {
			if (isViolatedUniqueConstraintError(e)) {
				throw new ForbiddenException('user with this email already exist');
			}
			throw e;
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('/getCurrent')
	async getCurrent(@IAM('id') userId: string) {
		return this.repository.findOne({
			where: {
				id: userId,
			},
		});
	}
}
