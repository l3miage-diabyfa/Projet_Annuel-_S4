import { Injectable } from '@nestjs/common';
import { SenderService } from './sender.service';

@Injectable()
export class EmailService {
  constructor(private readonly senderService: SenderService) {}

  async sendWelcomeEmail(email: string, firstName: string, lastName: string): Promise<boolean> {
    const loginUrl = `${process.env.FRONTEND_URL}/auth/login`;
    return await this.senderService.sendEmail({
      to: email,
      subject: 'Bienvenue sur IZZZI ! 🎓',
      template: 'signup-welcome',
      context: {
        firstName,
        lastName,
        loginUrl,
      },
      from: 'IZZZI <tizisalim5@gmail.com>',
    });
  }

  async sendInvitationEmail(email: string, inviterfirstName: string, inviterlastName: string, invitationToken: string): Promise<boolean> {
    const invitationUrl = `${process.env.FRONTEND_URL}/auth/signup?invitation=${invitationToken}`;

    return await this.senderService.sendEmail({
      to: email,
      subject: `${inviterfirstName} ${inviterlastName} vous invite à rejoindre  la plateforme IZZZI`,
      template: 'signup-invitation',
      context: {
        inviterfirstName,
        inviterlastName,
        invitationUrl,
      },
      from: 'IZZZI <tizisalim5@gmail.com>',
    });
  }

  async sendInvitationConfirmationToAdmin(adminEmail: string, firstName: string, lastName: string, invitedEmail: string): Promise<boolean> {
    const roleLabels: Record<string, string> = {
      'ADMIN': 'Administrateur',
      'REFERENT': 'Référent'
    };

    return await this.senderService.sendEmail({
      to: adminEmail,
      subject: `Invitation envoyée à ${invitedEmail}`,
      template: 'invitation-confirmation',
      context: {
        firstName,
        lastName,
        invitedEmail,
      },
      from: 'IZZZI <tizisalim5@gmail.com>',
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    return await this.senderService.sendEmail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe - IZZZI',
      template: 'password-reset',
      context: {
        resetUrl,
      },
      from: 'IZZZI <tizisalim5@gmail.com>',
    });
  }
}