import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Request } from 'express';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Public } from '../common/decorators/public.decorator';
import { OptionalJwtGuard } from '../common/guards/optional-jwt.guard';

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

  // Public endpoint that opportunistically extracts the user from the JWT
  // when one is present. Anonymous submitters must supply dto.buyerName.
  @Public()
  @UseGuards(OptionalJwtGuard)
  @Post()
  create(
    @Req() req: Request,
    @Param('marketId') marketId: string,
    @Body() dto: CreatePurchaseDto,
  ) {
    const userId = (req.user as { id?: string } | undefined)?.id;
    return this.purchases.create(userId, marketId, dto);
  }
}
