import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: "L'ancien mot de passe est obligatoire." })
  oldPassword: string;

  @IsNotEmpty({ message: 'Le nouveau mot de passe est obligatoire.' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: 'Le mot de passe doit contenir des lettres et des chiffres.',
  })
  newPassword: string;
}
