"use client";
import { useState } from "react";

function Item({
  icon,
  q,
  a,
  href,
}: {
  icon: string;
  q: string;
  a: React.ReactNode;
  href?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/15 bg-white/60 p-4 shadow-sm ring-1 ring-white/10 transition-[background,color] dark:bg-neutral-900/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg" aria-hidden>{icon}</span>
          <span className="font-semibold">{q}</span>
        </div>
        <span className="text-xl" aria-hidden>{open ? "Ã¢Ë†â€™" : "+"}</span>
      </button>
      <div
        className={
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out " +
          (open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
        }
      >
        <div className="overflow-hidden">
          <div className="mt-2 text-sm opacity-85">
            {a}
            {href && (
              <div className="mt-2">
                <a href={href} className="text-sm underline">CiteÃˆâ„¢te ghidul complet Ã¢â€ â€™</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion() {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <header className="mb-3">
        <h2 className="text-xl font-bold u-underline-hover">ÃƒÅ½ntrebÃ„Æ’ri frecvente</h2>
        <p className="mt-1 text-sm opacity-70">RÃ„Æ’spunsuri rapide la cele mai comune ÃƒÂ®ntrebÃ„Æ’ri despre bonusuri Ãˆâ„¢i termeni.</p>
      </header>
      <div className="grid gap-3">
        <Item
          icon="Ã°Å¸â€™Â°"
          q="Cum revendic un bonus?"
          a={<>
            ApasÃ„Æ’ pe Ã¢â‚¬Å¾RevendicÃ„Æ’ bonusulÃ¢â‚¬Â, acceptÃ„Æ’ termenii Ãˆâ„¢i urmeazÃ„Æ’ paÃˆâ„¢ii operatorului. VerificÃ„Æ’ <span className="font-medium">termenii</span> (depunere minimÃ„Æ’, WR, valabilitate) ÃƒÂ®nainte de a ÃƒÂ®ncepe.
          </>}
          href="/ghiduri"
        />
        <Item
          icon="Ã¢ÂÂ³"
          q="Ce ÃƒÂ®nseamnÃ„Æ’ WR?"
          a={<>
            WR (Wagering Requirement) indicÃ„Æ’ <span className="font-medium">rulajul</span> necesar pentru a transforma bonusul ÃƒÂ®n bani reali. Exemplu: WR x30 ÃƒÂ®nseamnÃ„Æ’ cÃ„Æ’ valoarea bonusului trebuie rulatÃ„Æ’ de 30 de ori.
          </>}
          href="/unelte/calculator-wr"
        />
        <Item
          icon="Ã°Å¸Å½Â°"
          q="Care sunt cele mai bune oferte fÃ„Æ’rÃ„Æ’ depunere?"
          a={<>
            Ofertele fÃ„Æ’rÃ„Æ’ depunere sunt excelente pentru testare, ÃƒÂ®nsÃ„Æ’ verificÃ„Æ’ mereu <span className="font-medium">valabilitatea</span>, <span className="font-medium">max cashout</span> Ãˆâ„¢i <span className="font-medium">sloturile eligibile</span>.
          </>}
          href="/bonusuri-fara-depunere"
        />
      </div>
    </section>
  );
}
