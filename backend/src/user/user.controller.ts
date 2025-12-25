import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { CompleteInvitationDto } from './dto/complete-invitation.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.userService.registerAdmin(registerAdminDto);
  }

  @UseGuards(JwtAuthGuard)
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

  @Get('by-establishment/:establishmentId')
  async getUsersByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.userService.getUsersByEstablishment(establishmentId);
  }

  @Get('all')
  async getAllUsers() {
    //sécuriser la route
    return this.userService.getAllUsers();
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('account')
  async deleteAccount(@Request() req) {
    const userId = req.user.userId;
    return this.userService.deleteAccount(userId);
  }
}
