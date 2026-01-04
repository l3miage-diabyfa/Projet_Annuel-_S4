import { IsUUID, IsOptional } from 'class-validator';

export class AttachFormsDto {
  @IsOptional()
  @IsUUID()
  duringFormId?: string;

  @IsOptional()
  @IsUUID()
  afterFormId?: string;
}