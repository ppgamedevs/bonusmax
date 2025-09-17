import Link from 'next/link';
export const metadata = { title: 'Ajutor ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i suport | Bonusmax' };

export default function Page() {
  return (
    <section className="prose prose-invert mx-auto max-w-3xl px-4 py-8">
      <h1>Ajutor ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i suport</h1>
      <p className="text-zinc-300">GÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢seÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ti rÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢spunsuri rapide despre folosirea Bonusmax ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i ofertele listate.</p>
      
      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-lg font-semibold">Ghiduri ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i articole</h2>
          <ul className="space-y-2">
            <li><Link href="/ghiduri" className="text-blue-400 hover:underline">Ghiduri pentru ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®ncepÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢tori</Link></li>
            <li><a href="/ghiduri#faq" className="text-blue-400 hover:underline">ÃƒÆ’Ã†â€™Ãƒâ€¦Ã‚Â½ntrebÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ri frecvente</Link></li>
            <li><Link href="/blog" className="text-blue-400 hover:underline">Articole ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢tiri</Link></li>
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-lg font-semibold">Ai nevoie de ajutor?</h2>
          <ul className="space-y-3">
            <li>
              <h3 className="font-medium">Contact direct</h3>
              <p className="text-sm text-zinc-400">Scrie-ne la <a href="mailto:ajutor@bonusmax.ro" className="text-blue-400 hover:underline">ajutor@bonusmax.ro</Link></p>
            </li>
            <li>
              <h3 className="font-medium">Formular de contact</h3>
              <p className="text-sm text-zinc-400"><Link href="/contact" className="text-blue-400 hover:underline">Trimite un mesaj</Link> ÃƒÆ’Ã‹â€ ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i te vom contacta ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â®n maxim 24h</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
