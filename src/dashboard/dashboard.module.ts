import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Dashboard} from './entities/dashboard.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Dashboard])],
})
export class DashboardModule {}
