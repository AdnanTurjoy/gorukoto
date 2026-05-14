import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(marketId: string, page = 1, limit = 20) {
    const [total, items] = await this.prisma.$transaction([
      this.prisma.purchase.count({ where: { marketId } }),
      this.prisma.purchase.findMany({
        where: { marketId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { buyer: { select: { id: true, name: true, avatarUrl: true } } },
      }),
    ]);
    return { items, total, page, limit };
  }

  async create(userId: string, marketId: string, dto: CreatePurchaseDto) {
    const market = await this.prisma.market.findUnique({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    return this.prisma.purchase.create({
      data: { marketId, buyerId: userId, ...dto },
      include: { buyer: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }
}
