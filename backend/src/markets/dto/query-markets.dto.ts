import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CrowdLevel, PriceLevel } from '@prisma/client';

export enum MarketSort {
  Newest = 'newest',
  Cheapest = 'cheapest',
  Nearby = 'nearby',
}

export class QueryMarketsDto {
  @IsOptional() @IsString() division?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsEnum(PriceLevel) priceLevel?: PriceLevel;
  @IsOptional() @IsEnum(CrowdLevel) crowdLevel?: CrowdLevel;
  @IsOptional() @IsString() q?: string;

  @IsOptional() @Type(() => Number) @IsLatitude()
  lat?: number;

  @IsOptional() @Type(() => Number) @IsLongitude()
  lng?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(500)
  radiusKm?: number;

  @IsOptional() @IsEnum(MarketSort)
  sort?: MarketSort = MarketSort.Newest;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 20;
}
