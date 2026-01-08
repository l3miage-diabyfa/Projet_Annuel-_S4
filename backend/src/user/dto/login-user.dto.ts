import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
    password: string;
}
