import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleCompleteInvitationDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  invitationToken: string;
}
