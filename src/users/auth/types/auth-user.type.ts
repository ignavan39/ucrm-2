import { User } from 'src/users/entities/user.entity';

export type AuthUser = {
	user: Omit<User, 'password'>;
	token: string;
};

export interface JwtPayload {
	id: string;
	expiration: Date;
}
