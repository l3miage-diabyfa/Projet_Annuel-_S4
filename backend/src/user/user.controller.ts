import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { CompleteInvitationDto } from './dto/complete-invitation.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminRoleGuard } from './admin-role.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { GoogleCompleteInvitationDto } from './dto/google-complete-invitation.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.userService.registerAdmin(registerAdminDto);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('invite')
  async inviteUser(@Body() inviteUserDto: InviteUserDto, @Request() req) {
    const adminId = req.user.userId;
    return this.userService.inviteUser(inviteUserDto, adminId);
  }

  @Get('validate-invitation/:token')
  async validateInvitation(@Param('token') token: string) {
    return this.userService.validateInvitationToken(token);
  }

  @Post('complete-invitation')
  async completeInvitation(@Body() completeInvitationDto: CompleteInvitationDto) {
    const { invitationToken, email, firstname, lastname, password } = completeInvitationDto;
    return this.userService.completeInvitation(invitationToken, email, firstname, lastname, password);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('by-establishment')
  async getUsersByEstablishment(@Request() req) {
    const userId = req.user.userId;
    return this.userService.getUsersByEstablishment(userId);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.userService.googleLogin(googleLoginDto.token);
  }

  @Post('google-complete-invitation')
  async googleCompleteInvitation(@Body() googleInvitationDto: GoogleCompleteInvitationDto) {
    return this.userService.googleCompleteInvitation(googleInvitationDto.token, googleInvitationDto.invitationToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const userId = req.user.userId;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Request() req) {
    const userId = req.user.userId;
    return this.userService.updatePassword(userId, updatePasswordDto.oldPassword, updatePasswordDto.newPassword);
  }

  @Post('forgot-password')
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.userService.requestPasswordReset(body.email);
  }

  @Get('validate-reset-token/:token')
  async validateResetPasswordToken(@Param('token') token: string) {
    return this.userService.validateResetPasswordToken(token);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.userService.resetPassword(body.token, body.newPassword);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('account')
  async deleteAccount(@Request() req) {
    const userId = req.user.userId;
    return this.userService.deleteAccount(userId);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('update-role/:userId')
  async updateUserRole(
    @Param('userId') targetUserId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Request() req
  ) {
    const adminId = req.user.userId;
    return this.userService.updateUserRole(adminId, targetUserId, updateUserRoleDto.role);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('generate-share-link')
  async generateShareableInvitationLink(@Request() req) {
    const adminId = req.user.userId;
    return this.userService.generateShareableInvitationLink(adminId);
  }

  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('remove-access/:userId')
  async removeUserAccess(
    @Request() req,
    @Param('userId') targetUserId: string,
  ) {
    const adminId = req.user.userId;
    return this.userService.removeUserAccess(adminId, targetUserId);
  }
}
