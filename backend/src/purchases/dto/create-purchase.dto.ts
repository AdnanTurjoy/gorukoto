import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator';
import { CattleType } from '@prisma/client';

export class CreatePurchaseDto {
  @IsEnum(CattleType)
  cattleType!: CattleType;

  @IsInt() @Min(0) @Max(10_000_000)
  price!: number;

  @IsUrl({ require_tld: false })
  imageUrl!: string;

  @IsOptional() @IsString() @MaxLength(500)
  note?: string;
}
