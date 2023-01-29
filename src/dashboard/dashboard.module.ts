import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DashboardController} from './dashboard.controller';
import {Dashboard} from './entities/dashboard.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Dashboard])],
	controllers: [DashboardController],
})
export class DashboardModule {}
