import { IsInt, IsBoolean, Min } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsInt()
  @Min(1, { message: 'Le nombre de classes doit être au moins 1' })
  numberOfClasses: number;

  @IsBoolean()
  isAnnual: boolean;
}
