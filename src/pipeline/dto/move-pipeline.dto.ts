import {IsOptional, IsUUID} from 'class-validator';

export class MovePipelineDto {
	@IsOptional()
	@IsUUID()
	leftId?: string;
}
