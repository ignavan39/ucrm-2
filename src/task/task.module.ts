import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TaskType} from './entities/task-type.entity';
import {Task} from './entities/task.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Task, TaskType])],
})
export class TaskModule {}
