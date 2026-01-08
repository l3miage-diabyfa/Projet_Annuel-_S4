import { IsEmail, IsNotEmpty, MinLength, Matches, IsOptional } from 'class-validator';

export class RegisterAdminDto {
  @IsOptional()
  schoolName?: string;

  @IsEmail({}, { message: 'Adresse email invalide.' })
  @IsNotEmpty({ message: "L'adresse email est obligatoire." })
  email: string;

  @IsNotEmpty({ message: 'Le nom est obligatoire.' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères.' })
  lastname: string;

  @IsNotEmpty({ message: 'Le prénom est obligatoire.' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères.' })
  firstname: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'Le mot de passe doit contenir des lettres et des chiffres.'
  })
  password: string;
}