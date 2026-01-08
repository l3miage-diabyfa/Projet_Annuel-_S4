import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

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

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'Le mot de passe doit contenir des lettres et des chiffres.'
  })
  password: string;
}