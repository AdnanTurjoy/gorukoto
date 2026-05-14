import { Module } from '@nestjs/common';
import { PriceUpdatesService } from './price-updates.service';
import { PriceUpdatesController } from './price-updates.controller';

@Module({
  providers: [PriceUpdatesService],
  controllers: [PriceUpdatesController],
})
export class PriceUpdatesModule {}
