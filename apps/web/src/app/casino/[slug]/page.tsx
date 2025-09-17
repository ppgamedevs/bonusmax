import { notFound } from "next/navigation";
import { getOperatorBySlug, getOffersByType } from "@bonusmax/lib";
import { OfferType } from "@prisma/client";
import OfferCard from "../../../components/OfferCard";
import DisclosureBar from "../../../components/DisclosureBar";
import RatingStars from "../../../components/RatingStars";
import ProsCons from "../../../components/ProsCons";
import PromoStrip from "../../../components/PromoStrip";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const op = await getOperatorBySlug(slug);
  if (!op) return notFound();

  // Show all types for this operator (simple demo: recent by default)
  const offers = await getOffersByType(OfferType.CASINO, "RO", op.slug, "recent");

  return (
    <main className="container mx-auto px-4 py-8" id="main">
      <h1 className="text-2xl font-bold mb-4">{op.name}</h1>
      <div className="mt-2 mb-2 flex items-center gap-3">
        <RatingStars value={(op as any).rating ?? 0} />
        <span className="text-sm opacity-70">{(((op as any).rating ?? 0).toFixed ? (op as any).rating.toFixed(1) : (Number((op as any).rating ?? 0)).toFixed(1))}/5</span>
      </div>
      <ProsCons pros={(op as any).pros ?? []} cons={(op as any).cons ?? []} />
      <DisclosureBar />
      {/* Sponsored cross-sell (optional) */}
      <PromoStrip slot="OPERATOR_TOP" title="Sponsored" />
      {offers.length === 0 ? (
        <p className="opacity-70 text-sm">Momentan nu avem oferte pentru acest operator.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((o: any) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      )}
    </main>
  );
}
