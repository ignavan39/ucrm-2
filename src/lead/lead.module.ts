import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Lead])],
})
export class LeadModule {}
