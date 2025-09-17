import { prisma } from "../index";

export async function getSocialTotals() {
  const now = new Date();
  const start30 = new Date(now.getTime() - 30 * 864e5);
  const clicks = await prisma.clickEvent.count({ where: { ts: { gte: start30, lte: now } } });
  const operators = await prisma.operator.count({ where: { isLicensedRO: true } });
  const offers = await prisma.offer.count({
    where: {
      isActive: true,
      country: "RO",
      operator: { isLicensedRO: true },
      AND: [
        { OR: [{ startAt: null }, { startAt: { lte: now } }] },
        { OR: [{ endAt: null }, { endAt: { gte: now } }] },
      ],
    },
  });
  return { clicks30d: clicks, operators, offers };
}
