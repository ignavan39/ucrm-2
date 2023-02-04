import {User} from 'src/user/entities/user.entity';

export type AuthUser = {
	user: Omit<User, 'password'>;
	token: string;
};

export interface JwtPayload {
	id: string;
}
