import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, fullName: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Klypto CRM',
        template: './welcome', // Assuming templates will be added later
        context: {
          name: fullName,
        },
      });
      return true;
    } catch (error) {
      console.error('Email sending failed', error);
      return false;
    }
  }
}
