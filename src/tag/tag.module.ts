import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadTag } from './entities/tag-lead.entity';
import { Tag } from './entities/tag.entity';

@Module({
	imports: [TypeOrmModule.forFeature([LeadTag, Tag])],
})
export class TagModule {}
