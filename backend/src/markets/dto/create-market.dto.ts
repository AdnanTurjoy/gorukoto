import {
  IsDateString,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CrowdLevel, MarketSize, PriceLevel } from '@prisma/client';

export class CreateMarketDto {
  @IsString() @MinLength(2) @MaxLength(120)
  name!: string;

  @IsOptional() @IsString() @MaxLength(2000)
  description?: string;

  @IsString() @MaxLength(120)
  area!: string;

  @IsString() @MaxLength(80)
  district!: string;

  @IsString() @MaxLength(80)
  division!: string;

  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lng!: number;

  @IsEnum(MarketSize)
  marketSize: MarketSize = MarketSize.MEDIUM;

  @IsEnum(CrowdLevel)
  crowdLevel: CrowdLevel = CrowdLevel.MEDIUM;

  @IsEnum(PriceLevel)
  priceLevel: PriceLevel = PriceLevel.FAIR;

  @IsOptional() @IsInt() @Min(0) @Max(10_000_000)
  minPrice?: number;

  @IsOptional() @IsInt() @Min(0) @Max(10_000_000)
  maxPrice?: number;

  @IsOptional() @IsDateString()
  startsOn?: string;

  @IsOptional() @IsDateString()
  endsOn?: string;
}
