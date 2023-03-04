import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomFieldContactValue } from './entities/custom-field-contact-value.entity';
import { CustomFieldLeadValue } from './entities/custom-field-lead-value.entity';
import { CustomField } from './entities/custom-field.entity';

@Module({
	imports: [TypeOrmModule.forFeature([CustomField, CustomFieldLeadValue, CustomFieldContactValue])],
})
export class CustomFieldModule {}
