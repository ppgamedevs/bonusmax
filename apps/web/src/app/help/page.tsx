export const metadata = { title: 'Ajutor Ãˆâ„¢i suport | Bonusmax' };

export default function Page() {
  return (
    <section className="prose prose-invert mx-auto max-w-3xl px-4 py-8">
      <h1>Ajutor Ãˆâ„¢i suport</h1>
      <p className="text-zinc-300">GÃ„Æ’seÃˆâ„¢ti rÃ„Æ’spunsuri rapide despre folosirea Bonusmax Ãˆâ„¢i ofertele listate.</p>
      
      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-lg font-semibold">Ghiduri Ãˆâ„¢i articole</h2>
          <ul className="space-y-2">
            <li><a href="/ghiduri" className="text-blue-400 hover:underline">Ghiduri pentru ÃƒÂ®ncepÃ„Æ’tori</a></li>
            <li><a href="/ghiduri#faq" className="text-blue-400 hover:underline">ÃƒÅ½ntrebÃ„Æ’ri frecvente</a></li>
            <li><a href="/blog" className="text-blue-400 hover:underline">Articole Ãˆâ„¢i Ãˆâ„¢tiri</a></li>
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="mb-3 text-lg font-semibold">Ai nevoie de ajutor?</h2>
          <ul className="space-y-3">
            <li>
              <h3 className="font-medium">Contact direct</h3>
              <p className="text-sm text-zinc-400">Scrie-ne la <a href="mailto:ajutor@bonusmax.ro" className="text-blue-400 hover:underline">ajutor@bonusmax.ro</a></p>
            </li>
            <li>
              <h3 className="font-medium">Formular de contact</h3>
              <p className="text-sm text-zinc-400"><a href="/contact" className="text-blue-400 hover:underline">Trimite un mesaj</a> Ãˆâ„¢i te vom contacta ÃƒÂ®n maxim 24h</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
