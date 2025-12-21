import { Injectable, ConflictException } from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterReferentDto } from './dto/register-referent.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { MailerService } from './mailer.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) { }

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const { schoolName, email, lastName, firstName, password } = registerAdminDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Cet email est déjà utilisé.');
    const alreadyExists = await this.prisma.establishment.findUnique({ where: { name: schoolName } });
    if (alreadyExists) throw new ConflictException("Un établissement avec ce nom existe déjà.");
    const establishment = await this.prisma.establishment.create({ data: { name: schoolName } });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        lastname: lastName,
        firstname: firstName,
        password: hashedPassword,
        role: 'ADMIN',
        establishmentId: establishment.id,
      },
    });
    // await this.mailerService.sendUserConfirmation(user.email, user.firstname || user.lastname || user.email);
    const jwt = await this.authService.generateJwt(user);
    return { message: 'Administrateur créé', user, ...jwt };
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
    // await this.mailerService.sendUserConfirmation(user.email, user.firstname || user.lastname || user.email);
    const jwt = await this.authService.generateJwt(user);
    return { message: 'Référent créé', user, ...jwt };
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

  async getUsersByEstablishment(establishmentId: string) {
    return this.prisma.user.findMany({ where: { establishmentId } });
  }
}
