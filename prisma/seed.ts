import { PrismaClient, OfferType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Networks demo
  await prisma.affiliateNetwork.createMany({
    data: [
      { slug: 'generic', name: 'Generic', subidParam: 'subid', currency: 'RON' },
      { slug: 'impact', name: 'Impact (custom)', subidParam: 'subId', currency: 'RON' }
    ],
    skipDuplicates: true
  });
  // Operators demo
  await prisma.operator.createMany({
    data: [
      { slug: 'betano', name: 'Betano', isLicensedRO: true, website: 'https://betano.ro', onjnLicenseId: 'L12345', onjnLicenseExpiry: new Date(new Date().getFullYear()+1,0,1) as any },
      { slug: 'superbet', name: 'Superbet', isLicensedRO: true, website: 'https://superbet.ro', onjnLicenseId: 'L67890', onjnLicenseExpiry: new Date(new Date().getFullYear()+1,6,1) as any },
      { slug: 'netbet', name: 'NetBet', isLicensedRO: true, website: 'https://netbet.ro' },
      { slug: 'unibet', name: 'Unibet', isLicensedRO: true, website: 'https://unibet.ro' },
      { slug: 'vlad-cazino', name: 'Vlad Cazino', isLicensedRO: true, website: 'https://vladcazino.ro' }
    ],
    skipDuplicates: true
  });

  const betano = await prisma.operator.findUnique({ where: { slug: 'betano' } });
  const superbet = await prisma.operator.findUnique({ where: { slug: 'superbet' } });
  const netbet = await prisma.operator.findUnique({ where: { slug: 'netbet' } });

  if (!betano || !superbet || !netbet) return;

  await prisma.offer.createMany({
    data: [
      {
        operatorId: betano.id,
        title: '100% până la 600 RON + 50 Rotiri',
        offerType: OfferType.CASINO,
        termsShort: 'WR x30, min dep 20 RON, 7 zile',
        termsUrl: 'https://betano.ro/terms',
        ctaBaseUrl: 'https://example-tracker.com/click?aff_id=BMX001',
        urlTemplate: 'https://example-tracker.com/track?oid=123&subid={subid}',
        priority: 10,
        isSponsored: true,
        wrMultiplier: 30,
        minDeposit: 20,
        maxCashout: 1000
      },
      {
        operatorId: superbet.id,
        title: 'Bonus pariuri 250 RON',
        offerType: OfferType.PARIURI,
        termsShort: 'WR x6, cote min 1.5, 7 zile',
        termsUrl: 'https://superbet.ro/terms',
        ctaBaseUrl: 'https://example-tracker.com/click?aff_id=BMX002',
        urlTemplate: 'https://example-tracker.com/track?oid=456&subid={subid}',
        priority: 20,
        wrMultiplier: 6,
        minDeposit: 25,
        maxCashout: 2500
      },
      {
        operatorId: netbet.id,
        title: 'Fără depunere: 25 Rotiri',
        offerType: OfferType.FARA_DEPUNERE,
        termsShort: 'WR x40, max cashout 100 RON',
        termsUrl: 'https://netbet.ro/terms',
        ctaBaseUrl: 'https://example-tracker.com/click?aff_id=BMX003',
        urlTemplate: 'https://example-tracker.com/track?oid=789&subid={subid}',
        priority: 30,
        wrMultiplier: 40,
        maxCashout: 100
      }
    ] as any
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
