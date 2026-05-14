import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { MarketSort, QueryMarketsDto } from './dto/query-markets.dto';

const KM_PER_DEG_LAT = 111.32;

@Injectable()
export class MarketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(userId: string, dto: CreateMarketDto) {
    const market = await this.prisma.market.create({
      data: { ...dto, createdById: userId },
      include: this.detailInclude(),
    });
    await this.redis.invalidate('markets:list:*');
    return this.shape(market);
  }

  async findAll(query: QueryMarketsDto) {
    const key = `markets:list:${JSON.stringify(query)}`;
    const cached = await this.redis.getJson<unknown>(key);
    if (cached) return cached;

    const where: Prisma.MarketWhereInput = {};
    if (query.division) where.division = query.division;
    if (query.district) where.district = query.district;
    if (query.priceLevel) where.priceLevel = query.priceLevel;
    if (query.crowdLevel) where.crowdLevel = query.crowdLevel;
    if (query.q) where.name = { contains: query.q, mode: 'insensitive' };

    if (query.lat != null && query.lng != null && query.radiusKm) {
      const dLat = query.radiusKm / KM_PER_DEG_LAT;
      const dLng = query.radiusKm / (KM_PER_DEG_LAT * Math.cos((query.lat * Math.PI) / 180));
      where.lat = { gte: query.lat - dLat, lte: query.lat + dLat };
      where.lng = { gte: query.lng - dLng, lte: query.lng + dLng };
    }

    let orderBy: Prisma.MarketOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sort === MarketSort.Cheapest) orderBy = { minPrice: 'asc' };

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.market.count({ where }),
      this.prisma.market.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: this.listInclude(),
      }),
    ]);

    let items = rows.map((m) => this.shape(m));

    if (query.lat != null && query.lng != null) {
      items = items.map((m) => ({
        ...m,
        distanceKm: haversine(query.lat!, query.lng!, m.lat, m.lng),
      }));
      if (query.sort === MarketSort.Nearby) {
        items.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
      }
    }

    const result = { items, total, page: query.page, limit: query.limit };
    await this.redis.setJson(key, result, 30);
    return result;
  }

  async findOne(id: string) {
    const market = await this.prisma.market.findUnique({
      where: { id },
      include: this.detailInclude(),
    });
    if (!market) throw new NotFoundException('Market not found');
    return this.shape(market);
  }

  async update(userId: string, id: string, dto: UpdateMarketDto) {
    const existing = await this.prisma.market.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Market not found');
    if (existing.createdById !== userId) throw new ForbiddenException();

    const market = await this.prisma.market.update({
      where: { id },
      data: dto,
      include: this.detailInclude(),
    });
    await this.redis.invalidate('markets:list:*');
    return this.shape(market);
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.market.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Market not found');
    if (existing.createdById !== userId) throw new ForbiddenException();
    await this.prisma.market.delete({ where: { id } });
    await this.redis.invalidate('markets:list:*');
    return { id };
  }

  private listInclude() {
    return {
      createdBy: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { reviews: true, priceUpdates: true, purchases: true } },
    } satisfies Prisma.MarketInclude;
  }

  private detailInclude() {
    return {
      createdBy: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { reviews: true, priceUpdates: true, comments: true, purchases: true } },
    } satisfies Prisma.MarketInclude;
  }

  private shape<T extends { lat: number; lng: number }>(m: T) {
    return m as T & { distanceKm?: number };
  }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
