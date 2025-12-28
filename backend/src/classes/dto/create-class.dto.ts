import { IsString, IsNotEmpty, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Class name must be at least 1 character' })
  @MaxLength(100, { message: 'Class name must not exceed 100 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Academic year is required' })
  academicYear: string;

  @IsString()
  @IsNotEmpty({ message: 'Grade level is required' })
  gradeLevel: string;

  @IsUUID('4', { message: 'Teacher ID must be a valid UUID' })
  @IsNotEmpty()
  teacherId: string;

  @IsOptional()
  @IsString()
  studentEmails?: string;
}