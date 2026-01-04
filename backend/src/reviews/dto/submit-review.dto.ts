import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewResponseDto {
  @IsString()
  @IsNotEmpty()
  fieldId: string;

  @IsNotEmpty()
  value: any; // number (stars), string (radio/textarea), string[] (checkbox)
}

export class SubmitReviewDto {
  @IsString()
  @IsNotEmpty()
  formId: string;

  @IsOptional()
  @IsString()
  sessionId?: string; // For anonymous tracking

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewResponseDto)
  responses: ReviewResponseDto[];
}