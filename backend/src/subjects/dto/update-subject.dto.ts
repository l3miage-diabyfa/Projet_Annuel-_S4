import { 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsDateString,
  MinLength 
} from 'class-validator';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Le nom de la matière doit contenir au moins 1 caractère' })
  name?: string;

  @IsOptional()
  @IsString()
  instructorName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email de l\'intervenant invalide' })
  instructorEmail?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date du premier cours invalide' })
  firstLessonDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date du dernier cours invalide' })
  lastLessonDate?: string;
}