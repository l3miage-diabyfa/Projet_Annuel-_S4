import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsBoolean, 
  IsOptional, 
  IsUUID,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsJSON
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ReviewFormType {
  DURING_CLASS = 'DURING_CLASS',
  AFTER_CLASS = 'AFTER_CLASS',
}

export enum FieldType {
  STARS = 'STARS',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  TEXTAREA = 'TEXTAREA',
}

export class ReviewFormFieldDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsArray()
  options?: string[]; // For RADIO/CHECKBOX

  @IsInt()
  @Min(0)
  order: number;
}

export class CreateReviewFormDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(ReviewFormType)
  type: ReviewFormType;

  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewFormFieldDto)
  fields: ReviewFormFieldDto[];
}