import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JWTConfigService} from 'src/config/jwt-config.service';
import {AuthService} from './auth/auth.service';
import {JwtStrategy} from './auth/jwt.strategy';
import {User} from './entities/user.entity';
import {UsersController} from './user.controller';

//PassportModule.register({ session: true });

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
	controllers: [UsersController],
})
export class UsersModule {}
