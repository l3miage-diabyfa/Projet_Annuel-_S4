import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { EmailService } from '../common/email/email.service';
import { GoogleAuthService } from './google-auth.service';

import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Establishment, Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly googleAuthService: GoogleAuthService,
  ) { }

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const { schoolName, email, lastname, firstname, password } = registerAdminDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }

    if (!schoolName) {
      throw new ConflictException("Le nom de l'établissement est obligatoire pour créer un nouveau compte admin.");
    }

    const alreadyExists = await this.prisma.establishment.findUnique({ where: { name: schoolName } });
    if (alreadyExists) {
      throw new ConflictException("Un établissement avec ce nom existe déjà.");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const { establishment, user } = await this.prisma.$transaction(async (transaction: PrismaService) => {
      const establishment = await transaction.establishment.create({ data: { name: schoolName } });
      const user = await transaction.user.create({
        data: {
          id: uuidv4(),
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
    
    // Send welcome email
    let emailStatus: 'sent' | 'failed' = 'sent';
    let emailError: any = null;
    try {
      await this.emailService.sendWelcomeEmail(user.email, user.firstname, user.lastname);
    } catch (error: any) {
      emailStatus = 'failed';
      emailError = error?.response || error?.message || 'Erreur inconnue';
      console.error('⚠️ Erreur envoi email de bienvenue (registerAdmin):', emailError);
    }
    
    return {
      message: 'Admin enregistré avec succès',
      access_token: jwt.access_token,
      user: {
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
        establishment: establishment.name,
        provider: 'local',
      },
      emailStatus,
      ...(emailError && { emailError }),
    };
  }

  async validateInvitationToken(token: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { invitationToken: token },
      include: { establishment: true },
    });

    if (!user) {
      throw new UnauthorizedException('Le lien d\'invitation est invalide ou a déjà été utilisé');
    }

    if (!user.invitationExpiry || user.invitationExpiry < new Date()) {
      throw new UnauthorizedException('Le lien d\'invitation a expiré');
    }

    if (user.password && user.password !== '') {
      throw new ConflictException('Cette invitation a déjà été utilisée');
    }

    return {
      valid: true,
      email: user.email,
      role: user.role,
      establishment: user.establishment.name,
    };
  }

  async completeInvitation(invitationToken: string, email: string, firstname: string, lastname: string, password: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { invitationToken },
      include: { establishment: true },
    });

    if (!user) {
      throw new UnauthorizedException('Le lien d\'invitation est invalide ou a déjà été utilisé');
    }

    if (!user.invitationExpiry || user.invitationExpiry < new Date()) {
      throw new UnauthorizedException('Le lien d\'invitation a expiré');
    }

    if (user.email !== email) {
      throw new ConflictException('L\'email ne correspond pas à l\'invitation');
    }

    if (user.password && user.password !== '') {
      throw new ConflictException('Cette invitation a déjà été utilisée');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstname,
        lastname,
        password: hashedPassword,
        invitationToken: null,
        invitationExpiry: null,
      },
    });

    const jwt = await this.authService.generateJwt(updatedUser);

    // Send welcome email
    let emailStatus: 'sent' | 'failed' = 'sent';
    let emailError: any = null;
    try {
      await this.emailService.sendWelcomeEmail(updatedUser.email, updatedUser.firstname, updatedUser.lastname);
    } catch (error: any) {
      emailStatus = 'failed';
      emailError = error?.response || error?.message || 'Erreur inconnue';
      console.error('Erreur envoi email de bienvenue:', emailError);
    }

    return {
      message: 'Inscription complétée avec succès',
      access_token: jwt.access_token,
      user: {
        lastname: updatedUser.lastname,
        firstname: updatedUser.firstname,
        email: updatedUser.email,
        role: updatedUser.role,
        establishment: user.establishment.name,
        provider: 'local',      
      },
      emailStatus,
      ...(emailError && { emailError }),
    };
  }

  async inviteUser(inviteUserDto: InviteUserDto, adminId: string) {
    const { email, role } = inviteUserDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Cet email est déjà utilisé.');
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || !admin.establishmentId) throw new ConflictException("Impossible de trouver l'établissement de l'admin.");
    const establishment = await this.prisma.establishment.findUnique({ where: { id: admin.establishmentId } });
    if (!establishment) throw new ConflictException("Établissement introuvable.");
    const invitationToken = uuidv4();
    const invitationExpiry = new Date();
    invitationExpiry.setDate(invitationExpiry.getDate() + 7);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        lastname: '',
        firstname: '',
        password: '',
        role,
        establishmentId: admin.establishmentId,
        invitationToken,
        invitationExpiry,
      },
    });

    // Send invitation email
    await this.emailService.sendInvitationEmail(
      email,
      admin.firstname,
      admin.lastname,
      invitationToken,
    );
    
    // Send confirmation email to admin
    await this.emailService.sendInvitationConfirmationToAdmin(
      admin.email,
      admin.firstname,
      admin.lastname,
      email,
    );
    
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
    if (!user.password) {
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
        provider: user.provider || 'local',
        profilePic: user.profilePic,
      },
    };
  }

  async getUsersByEstablishment(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.establishmentId) {
      throw new UnauthorizedException('Utilisateur ou établissement introuvable');
    }
    
    return this.prisma.user.findMany({ 
      where: { 
        establishmentId: user.establishmentId,
        id: { not: userId }, // Exclude the requesting user
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        profilePic: true,
        role: true,
      },
    });
  }

  async updateUserRole(adminId: string, targetUserId: string, newRole: Role) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Seuls les administrateurs peuvent modifier les rôles');
    }

    const targetUser = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (targetUser.establishmentId !== admin.establishmentId) {
      throw new UnauthorizedException('Vous ne pouvez modifier que les utilisateurs de votre établissement');
    }

    if (adminId === targetUserId) {
      throw new ConflictException('Vous ne pouvez pas modifier votre propre rôle');
    }

    // Mettre à jour le rôle
    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        profilePic: true,
        role: true,
      },
    });

    return {
      message: 'Rôle mis à jour avec succès',
      user: updatedUser,
    };
  }

  async generateShareableInvitationLink(adminId: string) {
    const admin = await this.prisma.user.findUnique({ 
      where: { id: adminId },
      include: { establishment: true },
    });
    
    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Seuls les administrateurs peuvent générer des liens d\'invitation');
    }

    if (!admin.establishmentId) {
      throw new ConflictException('Établissement introuvable');
    }

    const shareToken = uuidv4();
    const shareExpiry = new Date();
    shareExpiry.setDate(shareExpiry.getDate() + 30); // 30 days validity

    // Update the establishment with the shareable token
    await this.prisma.establishment.update({
      where: { id: admin.establishmentId },
      data: {
        shareToken,
        shareTokenExpiry: shareExpiry,
      },
    });

    return {
      shareToken,
      expiresAt: shareExpiry,
    };
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
          provider: user.provider,
          profilePic: user.profilePic,
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
      // Prevent email change for Google accounts
      if (user.provider === 'google' && updateData.email && updateData.email !== user.email) {
        throw new UnauthorizedException('Impossible de modifier l\'email pour un compte Google.');
      }

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
        provider: updatedUser.provider,
        profilePic: updatedUser.profilePic,
      },
    };
  }

  // Helper method to hash password and update user
  private async hashAndUpdatePassword(userId: string, newPassword: string, additionalData?: any) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        ...additionalData,
      },
    });
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Prevent password change for Google accounts
    if (user.provider === 'google' || !user.password) {
      throw new UnauthorizedException('Impossible de modifier le mot de passe pour un compte Google. Gérez votre mot de passe via Google.');
    }

    // Check if old password is correct
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }

    await this.hashAndUpdatePassword(userId, newPassword);

    return {
      message: 'Mot de passe modifié avec succès',
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
        emailStatus: 'not_sent' as const,
      };
    }

    const resetToken = uuidv4();
    const resetExpiry = new Date();
    resetExpiry.setHours(resetExpiry.getHours() + 1); // Token valide 1 heure

    await this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetExpiry,
      },
    });

    let emailStatus: 'sent' | 'failed' = 'sent';
    let emailError: any = null;
    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
    } catch (error: any) {
      emailStatus = 'failed';
      emailError = error?.response || error?.message || 'Erreur inconnue';
      console.error('Erreur envoi email de reset password:', emailError);
    }

    return {
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      emailStatus,
      ...(emailError && { emailError }),
    };
  }

  async validateResetPasswordToken(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Le lien de réinitialisation est invalide ou a déjà été utilisé');
    }

    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      throw new UnauthorizedException('Le lien de réinitialisation a expiré');
    }

    return {
      valid: true,
      email: user.email,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Le lien de réinitialisation est invalide ou a déjà été utilisé');
    }

    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      throw new UnauthorizedException('Le lien de réinitialisation a expiré');
    }

    await this.hashAndUpdatePassword(user.id, newPassword, {
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    });

    return {
      message: 'Mot de passe réinitialisé avec succès',
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

  async googleLogin(googleToken: string) {
    // Verify the Google token
    const googleUser = await this.googleAuthService.verifyGoogleToken(googleToken);

    if (!googleUser.emailVerified) {
      throw new UnauthorizedException('Email Google non vérifié');
    }

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
      include: { establishment: true },
    });

    if (user) {
      // Update user with Google info if not already set
      if (!user.googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.googleId,
            provider: 'google',
            profilePic: googleUser.profilePic || user.profilePic,
          },
          include: { establishment: true },
        });
      }
    } else {
      // New user - they need to be invited first
      throw new UnauthorizedException(
        'Aucun compte trouvé avec cet email Google. Veuillez demander une invitation à votre établissement.'
      );
    }

    // Generate JWT
    const jwt = await this.authService.generateJwt(user);

    return {
      message: 'Connexion Google réussie',
      access_token: jwt.access_token,
      user: {
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
        establishment: user.establishment?.name,
        profilePic: user.profilePic,
        provider: user.provider || 'google',
      },
    };
  }

  async googleCompleteInvitation(googleToken: string, invitationToken: string) {
    // Verify the Google token
    const googleUser = await this.googleAuthService.verifyGoogleToken(googleToken);

    if (!googleUser.emailVerified) {
      throw new UnauthorizedException('Email Google non vérifié');
    }

    if (!googleUser.email || !googleUser.googleId) {
      throw new UnauthorizedException('Informations Google incomplètes');
    }

    // Find user by invitation token
    const user = await this.prisma.user.findUnique({
      where: { invitationToken },
      include: { establishment: true },
    });

    if (!user) {
      throw new UnauthorizedException('Le lien d\'invitation est invalide ou a déjà été utilisé');
    }

    if (!user.invitationExpiry || user.invitationExpiry < new Date()) {
      throw new UnauthorizedException('Le lien d\'invitation a expiré');
    }

    if (user.email !== googleUser.email) {
      throw new ConflictException('L\'email Google ne correspond pas à l\'invitation');
    }

    if (user.password) {
      throw new ConflictException('Cette invitation a déjà été utilisée');
    }

    // Update user with Google info
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstname: googleUser.firstName || '',
        lastname: googleUser.lastName || '',
        googleId: googleUser.googleId!,
        provider: 'google',
        profilePic: googleUser.profilePic || null,
        invitationToken: null,
        invitationExpiry: null,
        password: null, // No password for Google users
      },
      include: { establishment: true },
    });

    const jwt = await this.authService.generateJwt(updatedUser);

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(updatedUser.email, updatedUser.firstname, updatedUser.lastname);
    } catch (error: any) {
      console.error('⚠️ Erreur envoi email de bienvenue (googleCompleteInvitation):', error?.response || error?.message);
    }

    return {
      message: 'Invitation complétée avec succès via Google',
      access_token: jwt.access_token,
      user: {
        lastname: updatedUser.lastname,
        firstname: updatedUser.firstname,
        email: updatedUser.email,
        role: updatedUser.role,
        establishment: updatedUser.establishment.name,
        profilePic: updatedUser.profilePic,
        provider: updatedUser.provider || 'google',
      },
    };
  }

  async removeUserAccess(adminId: string, targetUserId: string) {
    const admin = await this.prisma.user.findUnique({ 
      where: { id: adminId },
      include: { establishment: true }
    });

    if (!admin) {
      throw new UnauthorizedException('Administrateur introuvable');
    }

    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Seul un administrateur peut supprimer des utilisateurs');
    }

    const targetUser = await this.prisma.user.findUnique({ 
      where: { id: targetUserId }
    });

    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (targetUser.establishmentId !== admin.establishmentId) {
      throw new UnauthorizedException('Vous ne pouvez supprimer que les utilisateurs de votre établissement');
    }

    if (targetUser.id === admin.id) {
      throw new ConflictException('Vous ne pouvez pas supprimer votre propre compte de cette manière');
    }

    await this.prisma.user.delete({
      where: { id: targetUserId }
    });

    return {
      message: 'Utilisateur supprimé avec succès',
    };
  }
}
