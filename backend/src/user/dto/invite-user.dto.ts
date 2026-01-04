import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class InviteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role, { message: 'Le rôle doit être ADMIN ou TEACHER.' })
  role: Role;
}
