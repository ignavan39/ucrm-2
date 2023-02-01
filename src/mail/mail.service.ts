import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import {join} from 'path';

@Injectable()
export class MailService {
    private verificationCodeTemplate: HandlebarsTemplateDelegate;
	constructor() {
        //TODO make better
		const verificationCodeFile = fs
			.readFileSync(join(__dirname, '/templates/verification-code.hbs'))
			.toString();
		this.verificationCodeTemplate = Handlebars.compile(verificationCodeFile);
	}

	async sendUserVerificationCode(email: string, code: string) {
		console.log(this.verificationCodeTemplate({code}));
	}
}
