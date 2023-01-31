import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/user/entities/user.entity';
import {DashboardController} from './dashboard.controller';
import {Dashboard} from './entities/dashboard.entity';
import {Permission} from './entities/permission.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Dashboard, Permission, User])],
	controllers: [DashboardController],
})
export class DashboardModule {}
