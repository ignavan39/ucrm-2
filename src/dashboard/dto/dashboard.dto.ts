import {IsNotEmpty} from 'class-validator';

export class CreateDashboardDto {
	@IsNotEmpty()
	name: string;
}

export class UpdateDashboardDto extends CreateDashboardDto {}
