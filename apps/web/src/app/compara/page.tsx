export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { prisma, offerEpcByOffer } from '@bonusmax/lib';
import CompareTable from '@/components/compare/CompareTable';
import CompareClient from '@/components/compare/CompareClient';
import CompareRecommendation from '@/components/compare/CompareRecommendation';

export const metadata = {
  title: 'Comparație oferte — Bonusmax (RO)',
  description:
    'Compară bonusuri și termeni — doar operatori licențiați ONJN. 18+ Joacă responsabil.',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const sp = (await searchParams) || ({} as Record<string, string>);
  const idsParam = typeof sp.ids === 'string' ? (sp.ids as string) : '';
  const ids = idsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  // 1) Oferte pentru tabel
  let offers: any[] = [];
  if (ids.length) {
    const rows = await (prisma as any).offer.findMany({ where: { id: { in: ids } }, take: 4 });
    offers = rows.map((o: any) => ({
      id: o.id,
      brand: o.brand ?? o.name ?? 'Brand',
      logoUrl: o.logoUrl ?? null,
      headline: o.headline ?? o.title ?? '',
      terms: o.terms ?? '',
      isLicensedRO: !!(o.isLicensedRO ?? o.isLicensed ?? true),
      isSponsored: !!(o.isSponsored ?? false),
      // WR: prefer explicit multiplier (number) -> format as xN; else fallback to string-like fields
      wr: (() => {
        const m = (o as any).wrMultiplier ?? (o as any).wr ?? (o as any).wageringRequirements;
        if (typeof m === 'number' && Number.isFinite(m)) return `x${m}`;
        if (typeof m === 'string') return m.trim();
        return null;
      })(),
      // Min deposit: prefer numeric, fallback to legacy fields
      minDeposit: (() => {
        const md = o.minDeposit ?? (o as any).min_deposit ?? null;
        if (typeof md === 'number' && md > 0) return `${md} RON`;
        if (typeof md === 'string' && md) return md;
        return null;
      })(),
      // Validity in days; also compute a human-readable time limit if hours are present
      validity: (() => {
        const d = (o as any).validityDays ?? (o as any).validDays ?? null;
        if (typeof d === 'number' && d > 0) return `${d} zile`;
        if (typeof d === 'string' && d) return d;
        return null;
      })(),
      timeLimit: (() => {
        const h = (o as any).validityHours ?? null;
        if (typeof h === 'number' && h > 0) return `${h} ore`;
        return null;
      })(),
      // Max bonus: prefer explicit numeric amount; fallbacks to other likely fields
      maxBonus: (() => {
        const mb = (o as any).maxBonus ?? (o as any).bonusAmount ?? (o as any).max_bonus ?? null;
        if (typeof mb === 'number' && mb > 0) return `${mb} RON`;
        if (typeof mb === 'string' && mb) return mb;
        return null;
      })(),
      // Spins: various legacy names
      spins: (() => {
        const s = (o as any).spins ?? (o as any).freeSpins ?? (o as any).rotiri ?? null;
        if (typeof s === 'number' && s > 0) return `${s}`;
        if (typeof s === 'string' && s) return s;
        return null;
      })(),
      app:
        (o as any).hasAppIos || (o as any).hasAppAndroid
          ? ['iOS', (o as any).hasAppAndroid && 'Android'].filter(Boolean).join('/')
          : null,
      payments: Array.isArray((o as any).payments)
        ? (o as any).payments
        : (o as any).paymentsJson
          ? JSON.parse((o as any).paymentsJson)
          : [],
      pros: Array.isArray((o as any).pros)
        ? (o as any).pros.slice(0, 2)
        : typeof (o as any).prosJson === 'string'
          ? (JSON.parse((o as any).prosJson) as string[]).slice(0, 2)
          : [],
    }));
    // păstrăm ordinea cerută
    const byId = new Map(offers.map((x) => [x.id, x]));
    offers = ids.map((id) => byId.get(id)).filter(Boolean) as any[];
  }

  // 2) EPC (30 zile) și alegerea recomandării
  let highlightOfferId: string | undefined;
  let reco: { offer: any; clicks: number; revenue: number; epc: number } | null = null;
  if (offers.length) {
    const metrics = await offerEpcByOffer(
      offers.map((o) => o.id),
      30
    );
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
      <h1 className="text-2xl font-bold">Comparație oferte</h1>
      <p className="mt-1 text-sm opacity-80">
        Doar operatori licențiați ONJN. „Sponsored” marcat clar. 18+ Joacă responsabil.
      </p>

      <div className="mt-4 overflow-x-auto">
        <CompareTable offers={offers} highlightOfferId={highlightOfferId} />
      </div>

      {reco && (
        <CompareRecommendation
          offer={reco.offer}
          metrics={{ clicks: reco.clicks, revenue: reco.revenue, epc: reco.epc, days: 30 }}
        />
      )}

      {/* Fallback client-side din localStorage dacÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ nu avem ids ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â®n URL */}
      <CompareClient hasServer={offers.length > 0} />
    </main>
  );
}
