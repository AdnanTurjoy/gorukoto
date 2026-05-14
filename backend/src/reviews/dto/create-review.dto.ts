import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { PriceLevel } from '@prisma/client';

export class CreateReviewDto {
  @IsEnum(PriceLevel)
  priceTag!: PriceLevel;

  @IsString() @MinLength(3) @MaxLength(2000)
  comment!: string;
}
