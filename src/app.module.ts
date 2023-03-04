import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { DashboardModule } from './dashboard/dashboard.module';
import * as configuration from './config';
import { StatusModule } from './status/status.module';
import { LeadModule } from './lead/lead.module';
import { ContactModule } from './contact/contact.module';
import { CustomFieldModule } from './custom-field/custom-field.module';
import { TaskModule } from './task/task.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration.configuration],
			validationSchema: configuration.validationSchema,
			validationOptions: configuration.validationOptions,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('database.host'),
				port: configService.get<number>('database.port'),
				username: configService.get<string>('database.username'),
				password: configService.get<string>('database.password'),
				database: configService.get<string>('database.name'),
				entities: [join(__dirname, '../../**', '*.entity.js')],
				synchronize: true,
				logging: true,
				namingStrategy: new SnakeNamingStrategy(),
			}),
		}),
		AuthModule,
		UsersModule,
		PipelineModule,
		DashboardModule,
		StatusModule,
		LeadModule,
		ContactModule,
		CustomFieldModule,
		TaskModule,
		TagModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
