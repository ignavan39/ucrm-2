import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from 'src/auth/auth.module';
import {User} from './entities/user.entity';
import {UsersController} from './user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User]), AuthModule],
	controllers: [UsersController],
})
export class UsersModule {}
