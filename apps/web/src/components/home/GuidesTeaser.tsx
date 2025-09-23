import Link from 'next/link';
export default function GuidesTeaser() {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <header className="mb-3">
        <h2 className="text-xl font-bold u-underline-hover">Ghiduri utile</h2>
        <p className="mt-1 text-sm opacity-70">
          Sfaturi rapide pentru bonusuri, termeni și strategii responsabile.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Cum funcționează WR (Wagering Requirement)</div>
          <p className="mt-1 text-xs opacity-70">
            Ce înseamnă x30, x40 și cum calculezi rulajul corect.
          </p>
        </Link>
        <Link href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Bonusuri fără depunere: ce trebuie să știi</div>
          <p className="mt-1 text-xs opacity-70">
            Când merită, capcane frecvente și cum verifici termenii.
          </p>
        </Link>
        <Link href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Rotiri gratuite: condiții și max cashout</div>
          <p className="mt-1 text-xs opacity-70">Ce sloturi se aplică și cum maximizezi șansele.</p>
        </Link>
      </div>
      <div className="mt-3 text-right">
        <Link href="/ghiduri" className="text-sm underline">
          Vezi toate ghidurile →
        </Link>
      </div>
    </section>
  );
}
