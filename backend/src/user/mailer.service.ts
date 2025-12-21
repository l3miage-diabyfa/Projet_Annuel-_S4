import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) { }

  async sendUserConfirmation(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmation d’inscription IZZZI',
      template: './confirmation',
      context: {
        name,
      },
      text: `Bienvenue sur IZZZI, ${name} ! Votre inscription est confirmée.`,
    });
  }
}
