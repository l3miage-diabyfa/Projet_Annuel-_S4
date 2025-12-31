import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsEnum(Role, { message: 'Le rôle doit être ADMIN ou REFERENT.' })
  @IsNotEmpty()
  role: Role;
}
