import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendWelcomeEmail(email: string, fullName: string): Promise<boolean>;
}
