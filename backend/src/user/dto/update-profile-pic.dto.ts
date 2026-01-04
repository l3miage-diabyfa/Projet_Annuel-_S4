import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfilePicDto {
  @IsNotEmpty({ message: 'La photo de profil est requise' })
  @IsString({ message: 'La photo de profil doit être une chaîne de caractères' })
  profilePic: string;
}