import { getSocialTotals } from "@bonusmax/lib";

export default async function SocialProof() {
  const t = await getSocialTotals();
  const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl border p-4 text-center">
      <div className="text-2xl u-figure">{value}</div>
      <div className="mt-1 text-xs opacity-70">{label}</div>
    </div>
  );
  return (
    <section className="mx-auto mt-6 max-w-5xl px-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Clicks urmărite (30 zile)" value={new Intl.NumberFormat("ro-RO").format(t.clicks30d)} />
        <Stat label="Operatori licențiați" value={String(t.operators)} />
        <Stat label="Oferte active" value={String(t.offers)} />
      </div>
    </section>
  );
}
