import OfferCard from '../OfferCard';
import { prisma } from '@bonusmax/lib';

export default async function CtaOffer({ id }: { id: string }) {
  const offer = await (prisma as any).offer.findUnique({
    where: { id },
    include: { operator: true },
  });
  if (!offer || !offer.isActive || !offer.operator?.isLicensedRO) return null;
  return (
    <section className="mt-6">
      <h3 className="text-base font-semibold">Ofertă relevantă</h3>
      <div className="mt-2">
        <OfferCard offer={offer as any} />
      </div>
      <p className="mt-2 text-xs opacity-60">Conținut comercial • 18+ Joacă responsabil.</p>
    </section>
  );
}
