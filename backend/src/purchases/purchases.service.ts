import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

type PurchaseWithBuyer = Prisma.PurchaseGetPayload<{
  include: { buyer: { select: { id: true; name: true; avatarUrl: true } } };
}>;

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
    return { items: items.map((p) => this.shape(p)), total, page, limit };
  }

  async create(userId: string | undefined, marketId: string, dto: CreatePurchaseDto) {
    const market = await this.prisma.market.findUnique({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    let buyerName = dto.buyerName?.trim();

    if (userId && !buyerName) {
      // Fall back to the logged-in user's account name when the client didn't
      // pass one explicitly.
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      buyerName = user?.name;
    }

    if (!buyerName) {
      throw new BadRequestException('buyerName is required for anonymous purchases');
    }

    const created = await this.prisma.purchase.create({
      data: {
        marketId,
        buyerId: userId ?? null,
        buyerName,
        cattleType: dto.cattleType,
        price: dto.price,
        imageUrl: dto.imageUrl,
        note: dto.note,
      },
      include: { buyer: { select: { id: true, name: true, avatarUrl: true } } },
    });

    return this.shape(created);
  }

  /** Collapse buyer + buyerName into a single buyer object for the client. */
  private shape(p: PurchaseWithBuyer) {
    return {
      id: p.id,
      marketId: p.marketId,
      cattleType: p.cattleType,
      price: p.price,
      imageUrl: p.imageUrl,
      note: p.note,
      createdAt: p.createdAt,
      buyer: {
        id: p.buyer?.id ?? null,
        name: p.buyerName,
        avatarUrl: p.buyer?.avatarUrl ?? null,
      },
    };
  }
}
