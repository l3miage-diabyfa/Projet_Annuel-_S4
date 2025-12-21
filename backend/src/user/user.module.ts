import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER || 'user@example.com',
          pass: process.env.SMTP_PASS || 'password',
        },
      },
      defaults: {
        from: 'IZZZI <no-reply@izzzi.com>',
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService, MailerService, JwtStrategy],
})
export class UserModule {}
