import {IsNotEmpty, IsUUID} from 'class-validator';

export class CreatePipelineDto {
	@IsNotEmpty()
	@IsUUID()
	dashboardId: string;

	@IsNotEmpty()
	name: string;
}
