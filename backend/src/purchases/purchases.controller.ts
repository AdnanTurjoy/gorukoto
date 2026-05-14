import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

class PageQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit: number = 20;
}

@Controller('markets/:marketId/purchases')
export class PurchasesController {
  constructor(private readonly purchases: PurchasesService) {}

  @Public()
  @Get()
  list(@Param('marketId') marketId: string, @Query() q: PageQuery) {
    return this.purchases.list(marketId, q.page, q.limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Param('marketId') marketId: string,
    @Body() dto: CreatePurchaseDto,
  ) {
    return this.purchases.create(user.id, marketId, dto);
  }
}
