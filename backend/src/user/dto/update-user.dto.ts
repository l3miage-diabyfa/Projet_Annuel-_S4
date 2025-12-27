import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Le prénom doit être une chaîne de caractères.' })
  firstname?: string;

  @IsOptional()
  @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
  lastname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Adresse email invalide.' })
  email?: string;

  @IsOptional()
  @IsString({ 
    message: "Le nom de l'établissement doit être une chaîne de caractères." 
  })
  establishmentName?: string;
}
