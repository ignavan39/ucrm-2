import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Dashboard} from 'src/dashboard/entities/dashboard.entity';
import {Permission} from 'src/dashboard/entities/permission.entity';
import {Pipeline} from './entities/pipeline.entity';
import {PipelineController} from './pipeline.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Pipeline, Permission, Dashboard])],
	controllers: [PipelineController],
})
export class PipelineModule {}
