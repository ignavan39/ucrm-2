import { Body, Controller, ForbiddenException, NotFoundException, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { SignInDto, AuthCommonResponse, SignUpDto } from './dto';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('user')
export class UsersController {
	constructor(private readonly authService: AuthService, @InjectRepository(User) private readonly repository: Repository<User>) { }

	@Post('/sign-in')
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
			user: _.omit(user, ['password']),
			token,
		};
	}

	@Post('/sign-up')
	async signUp(@Body() body: SignUpDto): Promise<AuthCommonResponse> {
		const password = crypto.createHmac('sha256', body.password).digest('hex');

		try {
			const user = await this.repository.save({
				password,
				email: body.email,
				name: body.name,
				avatartUrl: body.avatarUrl,
			});
			const token = await this.authService.createJwtToken(user.id);
			return {
				user: _.omit(user, ['password']),
				token,
			};
		} catch (e) {
			if ('detail' in e && e.detail.includes('already exists')) {
				throw new ForbiddenException('user with this email already exist');
			}
		}
	}
}
