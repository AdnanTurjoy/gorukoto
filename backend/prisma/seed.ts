import { PrismaClient, PriceLevel, CrowdLevel, MarketSize, CattleType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const demo = await prisma.user.upsert({
    where: { email: 'demo@gorukoi.bd' },
    update: {},
    create: { email: 'demo@gorukoi.bd', name: 'ডেমো ইউজার', passwordHash },
  });

  const markets = [
    {
      name: 'গাবতলী হাট',
      area: 'Gabtoli', district: 'Dhaka', division: 'Dhaka',
      lat: 23.7806, lng: 90.3464,
      priceLevel: PriceLevel.EXPENSIVE, crowdLevel: CrowdLevel.PACKED, marketSize: MarketSize.XLARGE,
      minPrice: 80000, maxPrice: 500000,
    },
    {
      name: 'সাভার হাট',
      area: 'Savar', district: 'Dhaka', division: 'Dhaka',
      lat: 23.8583, lng: 90.2667,
      priceLevel: PriceLevel.FAIR, crowdLevel: CrowdLevel.HIGH, marketSize: MarketSize.LARGE,
      minPrice: 60000, maxPrice: 350000,
    },
    {
      name: 'চট্টগ্রাম বিবিরহাট',
      area: 'Bibirhat', district: 'Chattogram', division: 'Chattogram',
      lat: 22.3569, lng: 91.7832,
      priceLevel: PriceLevel.CHEAP, crowdLevel: CrowdLevel.MEDIUM, marketSize: MarketSize.LARGE,
      minPrice: 55000, maxPrice: 280000,
    },
  ];

  for (const m of markets) {
    const market = await prisma.market.upsert({
      where: { id: `seed-${m.name}` },
      update: {},
      create: { id: `seed-${m.name}`, createdById: demo.id, ...m },
    });

    await prisma.priceUpdate.upsert({
      where: { id: `seed-pu-${m.name}` },
      update: {},
      create: {
        id: `seed-pu-${m.name}`,
        marketId: market.id, reporterId: demo.id,
        cattleType: CattleType.COW,
        minPrice: m.minPrice ?? 50000, maxPrice: m.maxPrice ?? 200000,
        note: 'আজকের সকালের আপডেট',
      },
    });

    await prisma.purchase.upsert({
      where: { id: `seed-buy-${m.name}` },
      update: {},
      create: {
        id: `seed-buy-${m.name}`,
        marketId: market.id, buyerId: demo.id,
        cattleType: CattleType.COW,
        price: Math.round((m.minPrice ?? 60000) * 1.1),
        imageUrl: 'https://placehold.co/600x400/16a34a/white?text=Gorur+Chobi',
        note: 'আলহামদুলিল্লাহ, একটা সুন্দর গরু কিনে ফেললাম 🐄',
      },
    });
  }

  console.log('Seeded demo user + 3 markets + sample purchases');
}

main().finally(() => prisma.$disconnect());
