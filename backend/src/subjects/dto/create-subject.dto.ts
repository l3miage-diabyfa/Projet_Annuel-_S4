import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEmail, 
  IsDateString,
  MinLength 
} from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la matière est obligatoire' })
  @MinLength(2, { message: 'Le nom de la matière doit contenir au moins 2 caractères' })
  name: string;

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

  @IsString()
  @IsNotEmpty({ message: 'L\'ID de la classe est obligatoire' })
  classId: string;
}