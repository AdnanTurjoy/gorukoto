import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { CattleType } from '@prisma/client';

export class CreatePriceUpdateDto {
  @IsEnum(CattleType)
  cattleType!: CattleType;

  @IsInt() @Min(0) @Max(10_000_000)
  minPrice!: number;

  @IsInt() @Min(0) @Max(10_000_000)
  maxPrice!: number;

  @IsOptional() @IsString() @MaxLength(500)
  note?: string;
}
