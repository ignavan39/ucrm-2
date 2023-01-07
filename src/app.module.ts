import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      //TODO db name,
      type: 'postgresql',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
