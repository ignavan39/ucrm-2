import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Dashboard } from './entities/dashboard.entity';
import { Permission } from './entities/permission.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Dashboard, Permission, User])],
	controllers: [DashboardController],
	providers: [DashboardService],
})
export class DashboardModule {}
