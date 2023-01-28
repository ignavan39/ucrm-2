import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './types';
@Injectable()
export class AuthService {
	private tokenExpiresIn: number;

	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		readonly configService: ConfigService,
	) {
		this.tokenExpiresIn = this.configService.get<number>('jwt.expiresIn');
	}

	async createJwtToken(id: string): Promise<string> {
		const expiration = new Date();
		expiration.setTime(this.tokenExpiresIn * 1000 + expiration.getTime());

		const payload = { id, expiration } as JwtPayload;

		return this.jwtService.sign(payload);
	}

	async verifyTokenAsync(token: string): Promise<JwtPayload> {
		return this.jwtService.verifyAsync(token);
	}
	async validate(payload: JwtPayload): Promise<User> {
		return this.userRepository.findOne({ where: { id: payload.id } });
	}
}
