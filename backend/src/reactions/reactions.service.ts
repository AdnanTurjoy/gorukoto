import { Injectable, NotFoundException } from '@nestjs/common';
import { ReactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async react(userId: string, reviewId: string, type: ReactionType) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.reviewReaction.upsert({
      where: { reviewId_userId: { reviewId, userId } },
      update: { type },
      create: { reviewId, userId, type },
    });
  }

  async unreact(userId: string, reviewId: string) {
    await this.prisma.reviewReaction.deleteMany({ where: { reviewId, userId } });
    return { ok: true };
  }
}
