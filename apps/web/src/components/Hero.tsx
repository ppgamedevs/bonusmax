"use client";
export default function Hero({ updated }: { updated: string }) {
  const title = `Top oferte licenÃˆâ€ºiate ONJN Ã¢â‚¬â€ actualizat azi, ${updated}`;
  const subtitle = "ComparaÃˆâ€ºi bonusuri verificate, cu termeni clari. 18+ JoacÃ„Æ’ responsabil.";
  return (
    <section className="mx-auto max-w-5xl px-4 pt-10 pb-6 text-center">
      <p className="text-xs uppercase tracking-wide opacity-60">ConÃˆâ€ºinut comercial</p>
      <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm opacity-80">{subtitle}</p>
      <div className="mt-5 flex justify-center gap-3">
        <a
          href="#top-today"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-semibold underline hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Vezi Topul de azi
        </a>
        <a href="/bonusuri-fara-depunere" className="inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm">Bonus fÃ„Æ’rÃ„Æ’ depunere</a>
        <a href="/rotiri-gratuite" className="inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm">Rotiri gratuite</a>
      </div>
    </section>
  );
}
