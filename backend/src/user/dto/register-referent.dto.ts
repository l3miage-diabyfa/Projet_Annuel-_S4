import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterReferentDto {
  @IsEmail({}, { message: 'Adresse email invalide.' })
  @IsNotEmpty({ message: "L'adresse email est obligatoire." })
  email: string;

  @IsNotEmpty({ message: 'Le nom est obligatoire.' })
  lastname: string;

  @IsNotEmpty({ message: 'Le prénom est obligatoire.' })
  firstname: string;

  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'Le mot de passe doit contenir des lettres et des chiffres.'
  })
  password: string;

  @IsNotEmpty({ message: "L'établissement est obligatoire." })
  establishmentId: string;
}
