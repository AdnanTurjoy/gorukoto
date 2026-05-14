import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PriceUpdatesService } from './price-updates.service';
import { CreatePriceUpdateDto } from './dto/create-price-update.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

class PageQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit: number = 20;
}

@Controller('markets/:marketId/price-updates')
export class PriceUpdatesController {
  constructor(private readonly service: PriceUpdatesService) {}

  @Public()
  @Get()
  list(@Param('marketId') marketId: string, @Query() q: PageQuery) {
    return this.service.list(marketId, q.page, q.limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('marketId') marketId: string,
    @Body() dto: CreatePriceUpdateDto,
  ) {
    return this.service.create(user.id, marketId, dto);
  }
}
