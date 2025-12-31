import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  studentEmails?: string;
}