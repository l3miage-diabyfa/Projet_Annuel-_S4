import { IsString, IsNotEmpty, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Nom de classe doit contenir 1 charactère' })
  @MaxLength(100, { message: 'Nom de classe ne doit pas dépasser 100 caractères' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description ne doit pas dépasser 500 caractères' })
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Année académique est requise' })
  academicYear: string;

  @IsString()
  @IsNotEmpty({ message: 'Niveau de classe est requis' })
  gradeLevel: string;

  @IsUUID('4', { message: 'L\'ID du professeur doit être un UUID valide' })
  @IsNotEmpty()
  teacherId: string;
}