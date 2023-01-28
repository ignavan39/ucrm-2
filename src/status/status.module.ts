import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Status} from './entities/status.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Status])],
})
export class StatusModule {}
