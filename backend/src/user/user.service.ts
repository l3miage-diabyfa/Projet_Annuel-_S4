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
    
    // Check if user already exists with empty password (invited user)
    if (existing) {
      if (existing.password && existing.password !== '') {
        throw new ConflictException('Cet email est déjà utilisé.');
      }
      
      // Check if the existing user is linked to an establishment by invitation
      if (existing.establishmentId) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.update({
          where: { email },
          data: {
            lastname,
            firstname,
            password: hashedPassword,
            role: 'ADMIN',
          },
        });
        
        const establishment = await this.prisma.establishment.findUnique({ 
          where: { id: user.establishmentId } 
        });
        
        const jwt = await this.authService.generateJwt(user);
        return {
          message: 'Admin enregistré avec succès',
          access_token: jwt.access_token,
          user: {
            lastname: user.lastname,
            firstname: user.firstname,
            email: user.email,
            role: user.role,
            establishment: establishment?.name,
          },
        };
      }
    }
    
    // New admin registration requires schoolName
    if (!schoolName) {
      throw new ConflictException("Le nom de l'établissement est obligatoire pour créer un nouveau compte admin.");
    }
    
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
    return {
      message: 'Admin enregistré avec succès',
      access_token: jwt.access_token,
      user: {
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
        establishment: establishment.name,
      },
    };
  }

  async registerReferent(registerReferentDto: RegisterReferentDto) {
    const { email, lastname, firstname, password, establishmentId } = registerReferentDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      // if user exists with password, throw conflict
      if (existing.password && existing.password !== '') {
        throw new ConflictException('Cet email est déjà utilisé.');
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await this.prisma.user.update({
        where: { email },
        data: {
          lastname,
          firstname,
          password: hashedPassword,
          establishmentId,
        },
      });
      
      const establishment = await this.prisma.establishment.findUnique({ where: { id: establishmentId } });
      const jwt = await this.authService.generateJwt(updatedUser);
      
      return {
        message: 'Référent enregistré avec succès',
        access_token: jwt.access_token,
        user: {
          lastname: updatedUser.lastname,
          firstname: updatedUser.firstname,
          email: updatedUser.email,
          role: updatedUser.role,
          establishment: establishment?.name,
        },
      };
    }

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
    return {
      message: 'Référent enregistré avec succès',
      access_token: jwt.access_token,
      user: {
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
        establishment: establishment.name,
      },
    };
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
    return { 
      message: 'Invitation envoyée', 
      email: user.email,
      role: user.role,
      invitationToken,
      establishmentId: user.establishmentId,
    };
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
    // Get establishment name
    const establishment = await this.prisma.establishment.findUnique({ 
      where: { id: user.establishmentId } 
    });
    
    return {
      message: 'Connexion réussie',
      access_token: jwt.access_token,
      user: {
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
        establishment: establishment?.name,
      },
    };
  }

  async getUsersByEstablishment(establishmentId: string) {
    //protéger cette route dans le controller, seulement les admins et référents peuvent y accéder
    return this.prisma.user.findMany({ where: { establishmentId } });
  }

  async getAllUsers() {
    //sécuriser la route
    return this.prisma.user.findMany();
  }

  async updateUser(userId: string, updateData: { firstname?: string; lastname?: string; email?: string; establishmentName?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // check for email uniqueness if email is being updated
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({ where: { email: updateData.email } });
      if (existingUser) {
        throw new ConflictException('Cet email est déjà utilisé.');
      }
    }

    // check for establishment name uniqueness if establishmentName is being updated
    let currentEstablishment: Establishment | null = null;
    if (updateData.establishmentName && user.role === 'ADMIN' && user.establishmentId) {
      currentEstablishment = await this.prisma.establishment.findUnique({ 
        where: { id: user.establishmentId } 
      });
      
      // Only check for uniqueness if the name is actually changing
      if (currentEstablishment && updateData.establishmentName !== currentEstablishment.name) {
        const existingEstablishment = await this.prisma.establishment.findUnique({ 
          where: { name: updateData.establishmentName } 
        });
        if (existingEstablishment) {
          throw new ConflictException('Un établissement avec ce nom existe déjà.');
        }
      }
    }
    
    let hasUserChanges = false;
    let hasEstablishmentChanges = false;

    // Check for user info changes
    if ((updateData.firstname && updateData.firstname !== user.firstname) ||
        (updateData.lastname && updateData.lastname !== user.lastname) ||
        (updateData.email && updateData.email !== user.email)) {
      hasUserChanges = true;
    }

    // Check for establishment name changes
    if (updateData.establishmentName && user.role === 'ADMIN' && currentEstablishment) {
      if (updateData.establishmentName !== currentEstablishment.name) {
        hasEstablishmentChanges = true;
      }
    }

    // if no changes detected, return early
    if (!hasUserChanges && !hasEstablishmentChanges) {
      const establishment = await this.prisma.establishment.findUnique({ 
        where: { id: user.establishmentId } 
      });
      
      return {
        message: 'Aucune modification détectée',
        user: {
          lastname: user.lastname,
          firstname: user.firstname,
          email: user.email,
          role: user.role,
          establishmentName: establishment?.name,
        },
      };
    }

    // update establishment name if changed and user is ADMIN
    if (hasEstablishmentChanges && user.establishmentId) {
      await this.prisma.establishment.update({
        where: { id: user.establishmentId },
        data: { name: updateData.establishmentName },
      });
    }

    // update user info if changed
    let updatedUser = user;
    if (hasUserChanges) {
      updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(updateData.firstname && updateData.firstname !== user.firstname && { firstname: updateData.firstname }),
          ...(updateData.lastname && updateData.lastname !== user.lastname && { lastname: updateData.lastname }),
          ...(updateData.email && updateData.email !== user.email && { email: updateData.email }),
        },
      });
    }

    // fetch the possibly updated establishment name
    const establishmentModified = await this.prisma.establishment.findUnique({ 
      where: { id: updatedUser.establishmentId } 
    });

    return {
      message: 'Informations mises à jour avec succès',
      user: {
        lastname: updatedUser.lastname,
        firstname: updatedUser.firstname,
        email: updatedUser.email,
        role: updatedUser.role,
        establishment: establishmentModified?.name,
      },
    };
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Check if old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: 'Mot de passe modifié avec succès',
    };
  }

  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Only ADMIN can delete their establishment along with their account
    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Seul un administrateur peut supprimer son établissement');
    }

    if (!user.establishmentId) {
      throw new ConflictException('Aucun établissement associé à cet administrateur');
    }

    // Delete user and establishment in a transaction
    await this.prisma.$transaction(async (transaction: PrismaService) => {
      // Delete all users associated with the establishment
      await transaction.user.deleteMany({
        where: { establishmentId: user.establishmentId },
      });

      // Delete the establishment
      await transaction.establishment.delete({
        where: { id: user.establishmentId },
      });
    });

    return {
      message: 'Compte et établissement supprimés avec succès',
    };
  }
}
