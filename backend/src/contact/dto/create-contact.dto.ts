import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  organization: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsNotEmpty()
  classCount: number;

  @IsString()
  @IsOptional()
  message: string;

  @IsBoolean()
  @IsOptional()
  wantsCallback?: boolean;
}
