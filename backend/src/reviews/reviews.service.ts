import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForMarket(marketId: string, page = 1, limit = 20) {
    const [total, items] = await this.prisma.$transaction([
      this.prisma.review.count({ where: { marketId } }),
      this.prisma.review.findMany({
        where: { marketId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { reactions: true } },
          reactions: { select: { type: true } },
        },
      }),
    ]);

    return {
      items: items.map((r) => ({
        ...r,
        helpful: r.reactions.filter((x) => x.type === 'HELPFUL').length,
        notHelpful: r.reactions.filter((x) => x.type === 'NOT_HELPFUL').length,
        reactions: undefined,
      })),
      total,
      page,
      limit,
    };
  }

  async create(userId: string, marketId: string, dto: CreateReviewDto) {
    const market = await this.prisma.market.findUnique({ where: { id: marketId } });
    if (!market) throw new NotFoundException('Market not found');

    return this.prisma.review.create({
      data: { marketId, authorId: userId, ...dto },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }
}
