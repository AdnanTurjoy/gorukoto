import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePriceUpdateDto } from './dto/create-price-update.dto';

@Injectable()
export class PriceUpdatesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(marketId: string, page = 1, limit = 20) {
    const [total, items] = await this.prisma.$transaction([
      this.prisma.priceUpdate.count({ where: { marketId } }),
      this.prisma.priceUpdate.findMany({
        where: { marketId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { reporter: { select: { id: true, name: true, avatarUrl: true } } },
      }),
    ]);
    return { items, total, page, limit };
  }

  async create(userId: string, marketId: string, dto: CreatePriceUpdateDto) {
    if (dto.minPrice > dto.maxPrice) {
      throw new BadRequestException('minPrice must be ≤ maxPrice');
    }
    const market = await this.prisma.market.findUnique({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    return this.prisma.priceUpdate.create({
      data: { marketId, reporterId: userId, ...dto },
      include: { reporter: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }
}
