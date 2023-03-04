import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Contact])],
})
export class ContactModule {}
