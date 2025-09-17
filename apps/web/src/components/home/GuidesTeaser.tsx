import Link from 'next/link';
export default function GuidesTeaser() {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <header className="mb-3">
        <h2 className="text-xl font-bold u-underline-hover">Ghiduri utile</h2>
        <p className="mt-1 text-sm opacity-70">Sfaturi rapide pentru bonusuri, termeni ÃƒË†Ã¢â€žÂ¢i strategii responsabile.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Cum funcÃƒË†Ã¢â‚¬ÂºioneazÃƒâ€žÃ†â€™ WR (Wagering Requirement)</div>
          <p className="mt-1 text-xs opacity-70">Ce ÃƒÆ’Ã‚Â®nseamnÃƒâ€žÃ†â€™ x30, x40 ÃƒË†Ã¢â€žÂ¢i cum calculezi rulajul corect.</p>
        </Link>
        <Link href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Bonusuri fÃƒâ€žÃ†â€™rÃƒâ€žÃ†â€™ depunere: ce trebuie sÃƒâ€žÃ†â€™ ÃƒË†Ã¢â€žÂ¢tii</div>
          <p className="mt-1 text-xs opacity-70">CÃƒÆ’Ã‚Â¢nd meritÃƒâ€žÃ†â€™, capcane frecvente ÃƒË†Ã¢â€žÂ¢i cum verifici termenii.</p>
        </Link>
        <Link href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Rotiri gratuite: condiÃƒË†Ã¢â‚¬Âºii ÃƒË†Ã¢â€žÂ¢i max cashout</div>
          <p className="mt-1 text-xs opacity-70">Ce sloturi se aplicÃƒâ€žÃ†â€™ ÃƒË†Ã¢â€žÂ¢i cum maximizezi ÃƒË†Ã¢â€žÂ¢ansele.</p>
        </Link>
      </div>
      <div className="mt-3 text-right">
        <Link href="/ghiduri" className="text-sm underline">Vezi toate ghidurile ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢</Link>
      </div>
    </section>
  );
}
