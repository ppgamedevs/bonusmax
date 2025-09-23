import { prisma } from '@bonusmax/lib';
import { formatUpdatedRO } from '../../lib/datetime';

export default async function TopTodayHeader() {
  const r = await (prisma as any).offer.findMany({
    where: { isActive: true },
    select: { updatedAt: true },
    take: 25,
    orderBy: { updatedAt: 'desc' },
  });
  const updatedAt = (r[0]?.updatedAt as Date) || new Date();

  return (
    <header id="topul-de-azi" className="container mx-auto px-4 mt-10 md:mt-14 mb-3 md:mb-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold u-underline-hover">Top de azi (dinamic)</h2>
          <p className="text-sm opacity-70">
            Se actualizează după CTR, click-uri și recență — {formatUpdatedRO(updatedAt)}
          </p>
        </div>
        <p className="hidden text-xs opacity-60 md:block">„Conținut comercial” este marcat. 18+.</p>
      </div>
    </header>
  );
}
