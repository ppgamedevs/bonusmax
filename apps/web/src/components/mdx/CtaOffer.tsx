import OfferCard from "../OfferCard";
import { prisma } from "@bonusmax/lib";

export default async function CtaOffer({ id }: { id: string }) {
  const offer = await (prisma as any).offer.findUnique({ where: { id }, include: { operator: true } });
  if (!offer || !offer.isActive || !offer.operator?.isLicensedRO) return null;
  return (
    <section className="mt-6">
      <h3 className="text-base font-semibold">OfertÃ„Æ’ relevantÃ„Æ’</h3>
      <div className="mt-2">
        {/* @ts-expect-error server component usage in mdx */}
        <OfferCard offer={offer as any} />
      </div>
      <p className="mt-2 text-xs opacity-60">ConÃˆâ€ºinut comercial Ã¢â‚¬Â¢ 18+ JoacÃ„Æ’ responsabil.</p>
    </section>
  );
}
