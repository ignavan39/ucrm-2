import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pipeline } from './entities/pipeline.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Pipeline])],
})
export class PipelineModule { }
