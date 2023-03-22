import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('refresh_token')
export class RefreshToken extends BaseEntity {
	@Column('text')
	token: string;

	@Column('timestamp')
	expiresIn: Date;

	@ManyToOne(() => User)
	user: User;
}
