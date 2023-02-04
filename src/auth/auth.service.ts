import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/user/entities/user.entity';
import {Repository} from 'typeorm';
import {JwtPayload} from './types';
import * as dayjs from 'dayjs';
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
		const payload: JwtPayload = {
			id,
		};

		return this.jwtService.sign(payload);
	}

	async verifyTokenAsync(token: string): Promise<JwtPayload> {
		return this.jwtService.verifyAsync(token);
	}
	async validate(payload: JwtPayload): Promise<User> {
		return this.userRepository.findOne({where: {id: payload.id}});
	}
}
