import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JWTConfigService} from 'src/config/jwt-config.service';
import {User} from 'src/user/entities/user.entity';
import {AuthService} from './auth.service';
import {JwtStrategy} from './jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({defaultStrategy: 'jwt'}),
		JwtModule.registerAsync({
			useClass: JWTConfigService,
		}),
	],
	providers: [JwtStrategy, AuthService],
	exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {}
