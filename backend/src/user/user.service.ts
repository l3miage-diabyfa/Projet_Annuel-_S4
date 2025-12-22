import { Injectable, ConflictException } from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterReferentDto } from './dto/register-referent.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
// import { MailerService } from './mailer.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { User, Establishment } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    // private readonly mailerService: MailerService,
  ) { }

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const { schoolName, email, lastname, firstname, password } = registerAdminDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Cet email est déjà utilisé.');
    const alreadyExists = await this.prisma.establishment.findUnique({ where: { name: schoolName } });
    if (alreadyExists) throw new ConflictException("Un établissement avec ce nom existe déjà.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const { establishment, user } = await this.prisma.$transaction(async (transaction: PrismaService) => {
      const establishment = await transaction.establishment.create({ data: { name: schoolName } });
      const user = await transaction.user.create({
        data: {
          email,
          lastname: lastname,
          firstname: firstname,
          password: hashedPassword,
          role: 'ADMIN',
          establishmentId: establishment.id,
        },
      });
      return { establishment, user };
    });
    const jwt = await this.authService.generateJwt(user);
    return { message: 'Admin enregistré avec succès', access_token: jwt.access_token };
  }

  async registerReferent(registerReferentDto: RegisterReferentDto) {
    const { email, lastname, firstname, password, establishmentId } = registerReferentDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Cet email est déjà utilisé.');
    const establishment = await this.prisma.establishment.findUnique({ where: { id: establishmentId } });
    if (!establishment) throw new ConflictException("Établissement introuvable.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        lastname: lastname,
        firstname: firstname,
        password: hashedPassword,
        role: 'REFERENT',
        establishmentId,
      },
    });
    const jwt = await this.authService.generateJwt(user);
    return { message: 'Référent enregistré avec succès', access_token: jwt.access_token };
  }

  async inviteUser(inviteUserDto: InviteUserDto, adminId: string) {
    const { email, role } = inviteUserDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Cet email est déjà utilisé.');
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || !admin.establishmentId) throw new ConflictException("Impossible de trouver l'établissement de l'admin.");
    const invitationToken = uuidv4();
    const user = await this.prisma.user.create({
      data: {
        email,
        lastname: '',
        firstname: '',
        password: '',
        role,
        establishmentId: admin.establishmentId,
      },
    });
    // await this.mailerService.sendInvitation(email, invitationToken, role);
    return { message: 'Invitation envoyée', user, invitationToken };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    const jwt = await this.authService.generateJwt(user);
    return { message: 'Connexion réussie', access_token: jwt.access_token };
  }

  async getUsersByEstablishment(establishmentId: string) {
    //protéger cette route dans le controller, seulement les admins et référents peuvent y accéder
    return this.prisma.user.findMany({ where: { establishmentId } });
  }

  async getAllUsers() {
    //sécuriser la route
    return this.prisma.user.findMany();
  }
}
