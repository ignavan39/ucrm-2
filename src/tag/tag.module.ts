import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LeadTag} from './entites/tag-lead.entity';
import {Tag} from './entites/tag.entity';

@Module({
	imports: [TypeOrmModule.forFeature([LeadTag, Tag])],
})
export class TagModule {}
