import { IsInt, IsBoolean, Min } from 'class-validator';

export class ValidateCheckoutDto {
  @IsInt()
  @Min(1)
  numberOfClasses: number;

  @IsBoolean()
  isAnnual: boolean;
}
