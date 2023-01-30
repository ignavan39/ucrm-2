import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'staging', 'production'),
	ENVIRONMENT: Joi.string().valid('development', 'production', 'staging').required(),
	PORT: Joi.number().port().required(),
	CORS_CLIENT_URLS: Joi.string().required(),
	JWT_SECRET: Joi.string().required(),
	JWT_SECRET_EXPIRES_IN: Joi.number().integer().required(),
	DATABASE_HOST: Joi.string().hostname().required(),
	DATABASE_PORT: Joi.number().port().required(),
	DATABASE_NAME: Joi.string().required(),
	DATABASE_USER: Joi.string().required(),
	DATABASE_PASS: Joi.string().required(),
});

export const configuration = () => ({
	env: process.env.NODE_ENV,
	environment: process.env.ENVIRONMENT,
	port: parseInt(process.env.PORT, 10),
	corsClientUrls:
		process.env.CORS_CLIENT_URLS.length === 1 ? process.env.CORS_CLIENT_URLS : process.env.CORS_CLIENT_URLS.split(','),
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: parseInt(process.env.JWT_SECRET_EXPIRES_IN, 10),
	},
	database: {
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT, 10),
		name: process.env.DATABASE_NAME,
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
	},
});

export const validationOptions = {
	abortEarly: true,
};
