import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AdminRoleGuard } from './admin-role.guard';
import { EmailModule } from '../common/email/email.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService, JwtStrategy, AdminRoleGuard],
  exports: [JwtStrategy, AdminRoleGuard],
})
export class UserModule { }
