import {IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsUrl, MinLength} from 'class-validator';
import {AuthUser} from '../auth/types';

export class SignInDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;
}

export class SignUpDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsNotEmpty()
	name: string;

	@IsOptional()
	@IsUrl()
	avatarUrl?: string;
}

export type AuthCommonResponse = AuthUser;
