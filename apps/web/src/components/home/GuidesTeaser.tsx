export default function GuidesTeaser() {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <header className="mb-3">
        <h2 className="text-xl font-bold u-underline-hover">Ghiduri utile</h2>
        <p className="mt-1 text-sm opacity-70">Sfaturi rapide pentru bonusuri, termeni Ãˆâ„¢i strategii responsabile.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <a href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Cum funcÃˆâ€ºioneazÃ„Æ’ WR (Wagering Requirement)</div>
          <p className="mt-1 text-xs opacity-70">Ce ÃƒÂ®nseamnÃ„Æ’ x30, x40 Ãˆâ„¢i cum calculezi rulajul corect.</p>
        </a>
        <a href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Bonusuri fÃ„Æ’rÃ„Æ’ depunere: ce trebuie sÃ„Æ’ Ãˆâ„¢tii</div>
          <p className="mt-1 text-xs opacity-70">CÃƒÂ¢nd meritÃ„Æ’, capcane frecvente Ãˆâ„¢i cum verifici termenii.</p>
        </a>
        <a href="/ghiduri" className="rounded-xl border border-white/15 p-4 hover:bg-white/5">
          <div className="text-sm font-semibold">Rotiri gratuite: condiÃˆâ€ºii Ãˆâ„¢i max cashout</div>
          <p className="mt-1 text-xs opacity-70">Ce sloturi se aplicÃ„Æ’ Ãˆâ„¢i cum maximizezi Ãˆâ„¢ansele.</p>
        </a>
      </div>
      <div className="mt-3 text-right">
        <a href="/ghiduri" className="text-sm underline">Vezi toate ghidurile Ã¢â€ â€™</a>
      </div>
    </section>
  );
}
