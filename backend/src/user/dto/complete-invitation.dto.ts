import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CompleteInvitationDto {
  @IsString()
  @IsNotEmpty()
  invitationToken: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}