import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CustomFieldLeadValue} from './entities/custom-field-lead-value.entity';
import {CustomFieldLead} from './entities/custom-field-lead.entity';

@Module({
	imports: [TypeOrmModule.forFeature([CustomFieldLead, CustomFieldLeadValue])],
})
export class CustomFieldModule {}
