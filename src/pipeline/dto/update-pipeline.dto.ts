import { IsNotEmpty } from 'class-validator';

export class UpdatePipelineDto {
	@IsNotEmpty()
	name: string;
}
