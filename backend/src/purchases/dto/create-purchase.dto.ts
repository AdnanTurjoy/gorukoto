import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
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

  // Optional here because logged-in users don't need to supply it (service falls
  // back to their account name). The controller enforces presence for anonymous
  // submissions.
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80)
  buyerName?: string;
}
