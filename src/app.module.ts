import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/user.module';
import {PipelineModule} from './pipeline/pipeline.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as configuration from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

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
			}),
		}),
		UsersModule,
		PipelineModule,
		DashboardModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
