import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Permission} from 'src/dashboard/entities/permission.entity';
import {Pipeline} from './entities/pipeline.entity';
import {PipelineController} from './pipeline.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Pipeline, Permission])],
	controllers: [PipelineController],
})
export class PipelineModule {}
