import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterReferentDto } from './dto/register-referent.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.userService.registerAdmin(registerAdminDto);
  }

  @Post('register-referent')
  async registerReferent(@Body() registerReferentDto: RegisterReferentDto) {
    return this.userService.registerReferent(registerReferentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite')
  async inviteUser(@Body() inviteUserDto: InviteUserDto, @Request() req) {
    const adminId = req.user.userId;
    return this.userService.inviteUser(inviteUserDto, adminId);
  }

  @Get('by-establishment/:establishmentId')
  async getUsersByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.userService.getUsersByEstablishment(establishmentId);
  }
}
