import { prisma, offerEpcByOffer } from "@bonusmax/lib";
import CompareTable from "@/components/compare/CompareTable";
import CompareClient from "@/components/compare/CompareClient";
import CompareRecommendation from "@/components/compare/CompareRecommendation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "ComparaÃˆâ€ºie oferte Ã¢â‚¬â€ Bonusmax (RO)",
  description: "ComparÃ„Æ’ bonusuri Ãˆâ„¢i termeni Ã¢â‚¬â€ doar operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN. 18+ JoacÃ„Æ’ responsabil.",
};

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const sp = (await searchParams) || ({} as Record<string, string>);
  const idsParam = typeof sp.ids === "string" ? (sp.ids as string) : "";
  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);

  // 1) Oferte pentru tabel
  let offers: any[] = [];
  if (ids.length) {
    const rows = await (prisma as any).offer.findMany({ where: { id: { in: ids } }, take: 4 });
    offers = rows.map((o: any) => ({
      id: o.id,
      brand: o.brand ?? o.name ?? "Brand",
      logoUrl: o.logoUrl ?? null,
      headline: o.headline ?? o.title ?? "",
      terms: o.terms ?? "",
      isLicensedRO: !!(o.isLicensedRO ?? o.isLicensed ?? true),
      isSponsored: !!(o.isSponsored ?? false),
      wr: (o as any).wr || (o as any).wageringRequirements || null,
      minDeposit: o.minDeposit ? `${o.minDeposit} RON` : (o as any).min_deposit ? `${(o as any).min_deposit} RON` : null,
      validity: (o as any).validityDays ? `${(o as any).validityDays} zile` : null,
      app: (o as any).hasAppIos || (o as any).hasAppAndroid ? ["iOS", (o as any).hasAppAndroid && "Android"].filter(Boolean).join("/") : null,
      payments: Array.isArray((o as any).payments) ? (o as any).payments : (o as any).paymentsJson ? JSON.parse((o as any).paymentsJson) : [],
      pros: Array.isArray((o as any).pros) ? (o as any).pros.slice(0, 2) : [],
    }));
    // pÃ„Æ’strÃ„Æ’m ordinea cerutÃ„Æ’
    const byId = new Map(offers.map((x) => [x.id, x]));
    offers = ids.map((id) => byId.get(id)).filter(Boolean) as any[];
  }

  // 2) EPC (30 zile) Ãˆâ„¢i alegerea recomandÃ„Æ’rii
  let highlightOfferId: string | undefined;
  let reco: { offer: any; clicks: number; revenue: number; epc: number } | null = null;
  if (offers.length) {
    const metrics = await offerEpcByOffer(offers.map((o) => o.id), 30);
    const eligible = metrics.filter((m) => m.clicks >= 10).sort((a, b) => b.epc - a.epc);
    const best = eligible[0] || metrics.sort((a, b) => b.clicks - a.clicks)[0];
    if (best) {
      highlightOfferId = best.offerId as string;
      const off = offers.find((o) => o.id === best.offerId);
      if (off) reco = { offer: off, clicks: best.clicks, revenue: best.revenue, epc: best.epc };
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">ComparaÃˆâ€ºie oferte</h1>
      <p className="mt-1 text-sm opacity-80">Doar operatori licenÃˆâ€ºiaÃˆâ€ºi ONJN Ã¢â‚¬Â¢ Ã¢â‚¬Å¾SponsoredÃ¢â‚¬Â marcat Ã¢â‚¬Â¢ 18+ JoacÃ„Æ’ responsabil.</p>

      <div className="mt-4 overflow-x-auto">
        <CompareTable offers={offers} highlightOfferId={highlightOfferId} />
      </div>

      {reco && (
        <CompareRecommendation
          offer={reco.offer}
          metrics={{ clicks: reco.clicks, revenue: reco.revenue, epc: reco.epc, days: 30 }}
        />
      )}

      {/* Fallback client-side din localStorage dacÃ„Æ’ nu avem ids ÃƒÂ®n URL */}
      <CompareClient hasServer={offers.length > 0} />
    </main>
  );
}
