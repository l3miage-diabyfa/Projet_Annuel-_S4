import * as nodemailer from 'nodemailer';  
import { Transporter } from 'nodemailer';  
import { TemplateService } from './template.service';
import { IMailPayload } from './interfaces/mail.interface';
import { Injectable, OnModuleInit, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
  
@Injectable()  
export class SenderService implements OnModuleInit {  
  private transporter: Transporter;  
  
  constructor(
    private templateService: TemplateService) {}  
  
  async onModuleInit() {  
    this.transporter = nodemailer.createTransport({  
      host: process.env.SMTP_HOST || 'smtp.gmail.com',  
      port: parseInt(process.env.SMTP_PORT || '587'),  
      secure: process.env.SMTP_SECURE === 'true',
      auth: {  
        user: process.env.SMTP_USER,  
        pass: process.env.SMTP_PASS,  
      }
    });
  
    try {  
      await this.transporter.verify();  
    } catch (error: any) {  
      console.error('Échec connexion au serveur SMTP:', error?.message || error);
    }  
  }
  
  async sendEmail(payload: IMailPayload): Promise<boolean> {  
    const { to, subject, template, context, attachments, from } = payload;  
  
    const { html, error } = this.templateService.compile(template, context || {});  
  
    if (error) {  
      console.error(`Échec compilation template '${template}':`, error);
      throw new InternalServerErrorException({
        code: 'EMAIL_TEMPLATE_COMPILE_FAILED',
        template,
        message: 'Échec de compilation du template email',
        reason: String(error),
      });
    }  
  
    try {  
      const info = await this.transporter.sendMail({  
        from: from,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,  
        html,  
        attachments,  
      });

      if (!info?.accepted?.length) {
        throw new ServiceUnavailableException({
          code: 'SMTP_SEND_REJECTED',
          message: 'Le serveur SMTP a rejeté l\'envoi',
          accepted: info?.accepted ?? [],
          rejected: info?.rejected ?? [],
          response: info?.response,
        });
      }
      return true;  
    } catch (error: any) {  
      console.error(`Échec envoi email à ${to} avec template '${template}':`, error?.message || error);
      throw new ServiceUnavailableException({
        code: 'SMTP_SEND_FAILED',
        message: 'Impossible d\'envoyer l\'email',
        to: Array.isArray(to) ? to : [to],
        template,
        reason: error?.message || String(error),
      });
    }  
  }  
}