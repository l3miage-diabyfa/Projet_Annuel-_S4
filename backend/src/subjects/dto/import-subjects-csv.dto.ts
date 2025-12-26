import { 
  IsArray, 
  ValidateNested, 
  IsString, 
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MinLength 
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubjectCsvRowDto {
  @IsString()
  @IsNotEmpty({ message: 'Matiere_nom est obligatoire' })
  @MinLength(1, { message: 'Matiere_nom doit contenir au moins 1 caractère' })
  Matiere_nom: string;

  @IsOptional()
  @IsString()
  Intervenant_nom?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Intervenant_email invalide' })
  Intervenant_email?: string;

  @IsOptional()
  @IsString()
  Date_premier_cours?: string;

  @IsOptional()
  @IsString()
  Date_dernier_cours?: string;
}

export class ImportSubjectsCsvDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectCsvRowDto)
  subjects: SubjectCsvRowDto[];

  @IsString()
  @IsNotEmpty()
  classId: string;
}