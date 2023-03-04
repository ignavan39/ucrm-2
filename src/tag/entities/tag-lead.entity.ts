import { Unique, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Lead } from '../../lead/entities/lead.entity';
import { Tag } from './tag.entity';

@Unique(['lead', 'tag'])
@Entity('lead_tag')
export class LeadTag extends BaseEntity {
	@ManyToOne(() => Lead, lead => lead.id, { onDelete: 'CASCADE' })
	lead: Lead;

	@ManyToOne(() => Tag, tag => tag.id, { onDelete: 'CASCADE' })
	tag: Tag;
}
