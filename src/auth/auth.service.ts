import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { User } from '../user/entities/user.entity';
import { JwtPayload } from './types';
@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		readonly configService: ConfigService,
	) {}

	async createJwtToken(id: string): Promise<string> {
		const payload: JwtPayload = {
			id,
		};

		return this.jwtService.sign(payload);
	}

	async verifyTokenAsync(token: string): Promise<JwtPayload> {
		return this.jwtService.verifyAsync(token);
	}
	async validate(payload: JwtPayload): Promise<User> {
		return this.userRepository.findOne({ where: { id: payload.id } });
	}
}
