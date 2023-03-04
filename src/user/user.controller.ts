import { Body, Controller, ForbiddenException, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import * as _ from 'lodash';
import { IAM } from '../common/decorators';
import { SignInDto, AuthCommonResponse, SignUpDto } from './dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserService } from './user.service';
import { UserAlreadyExistException, UserNotFoundException } from './user.exceptions';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
	constructor(private readonly service: UserService) {}

	@Post('/signIn')
	async signIn(@Body() body: SignInDto): Promise<AuthCommonResponse> {
		try {
			return await this.service.signIn(body);
		} catch (e) {
			if (e instanceof UserNotFoundException) {
				throw new NotFoundException(e.message);
			}
			throw e;
		}
	}

	@Post('/signUp')
	async signUp(@Body() body: SignUpDto): Promise<AuthCommonResponse> {
		try {
			return await this.service.signUp(body);
		} catch (e) {
			if (e instanceof UserAlreadyExistException) {
				throw new ForbiddenException('user with this email already exist');
			}
			throw e;
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('/getCurrent')
	async getCurrent(@IAM('id') userId: string): Promise<User> {
		return this.service.getCurrent(userId);
	}
}
