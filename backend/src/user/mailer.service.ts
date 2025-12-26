// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailerService {
//   private transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST || 'smtp.example.com',
//       port: parseInt(process.env.SMTP_PORT || '587'),
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER || 'user@example.com',
//         pass: process.env.SMTP_PASS || 'password',
//       },
//     });
//   }

//   async sendUserConfirmation(email: string, name: string) {
//     await this.transporter.sendMail({
//       from: 'IZZZI <no-reply@izzzi.com>',
//       to: email,
//       subject: 'Bienvenue sur IZZZI',
//       text: `Bienvenue ${name} sur IZZZI !`,
//       html: `<p>Bienvenue <b>${name}</b> sur IZZZI !</p>`,
//     });
//   }
// }
