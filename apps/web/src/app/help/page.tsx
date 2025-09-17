import Link from 'next/link';
export const metadata = { title: 'Ajutor ÃƒË†Ã¢â€žÂ¢i suport | Bonusmax' };

export default function Page() {
  return (
    <section className="prose prose-invert mx-auto max-w-3xl px-4 py-8">
      <h1>Ajutor ÃƒË†Ã¢â€žÂ¢i suport</h1>
      <p className="text-zinc-300">GÃƒâ€žÃ†â€™seÃƒË†Ã¢â€žÂ¢ti rÃƒâ€žÃ†â€™spunsuri rapide despre folosirea Bonusmax ÃƒË†Ã¢â€žÂ¢i ofertele listate.</p>
      
      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-lg font-semibold">Ghiduri ÃƒË†Ã¢â€žÂ¢i articole</h2>
          <ul className="space-y-2">
            <li><Link href="/ghiduri" className="text-blue-400 hover:underline">Ghiduri pentru ÃƒÆ’Ã‚Â®ncepÃƒâ€žÃ†â€™tori</Link></li>
            <li><a href="/ghiduri#faq" className="text-blue-400 hover:underline">ÃƒÆ’Ã…Â½ntrebÃƒâ€žÃ†â€™ri frecvente</Link></li>
            <li><Link href="/blog" className="text-blue-400 hover:underline">Articole ÃƒË†Ã¢â€žÂ¢i ÃƒË†Ã¢â€žÂ¢tiri</Link></li>
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
              <p className="text-sm text-zinc-400"><Link href="/contact" className="text-blue-400 hover:underline">Trimite un mesaj</Link> ÃƒË†Ã¢â€žÂ¢i te vom contacta ÃƒÆ’Ã‚Â®n maxim 24h</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
