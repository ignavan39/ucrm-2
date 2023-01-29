import {BaseEntity} from 'src/common/base.entity';
import {Lead} from 'src/lead/entities/lead.entity';
import {Unique, Entity, ManyToOne} from 'typeorm';
import {Tag} from './tag.entity';

@Unique(['lead', 'tag'])
@Entity('lead_tag')
export class LeadTag extends BaseEntity {
	@ManyToOne(() => Lead, lead => lead.id, {onDelete: 'CASCADE'})
	lead: Lead;

	@ManyToOne(() => Tag, tag => tag.id, {onDelete: 'CASCADE'})
	tag: Tag;
}
