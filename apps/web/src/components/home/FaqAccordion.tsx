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
        <span className="text-xl" aria-hidden>{open ? "−" : "+"}</span>
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
                <a href={href} className="text-sm underline">Citește ghidul complet →</a>
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
        <h2 className="text-xl font-bold u-underline-hover">Întrebări frecvente</h2>
        <p className="mt-1 text-sm opacity-70">Răspunsuri rapide la cele mai comune întrebări despre bonusuri și termeni.</p>
      </header>
      <div className="grid gap-3">
        <Item
          icon="💰"
          q="Cum revendic un bonus?"
          a={<>
            Apasă pe „Revendică bonusul”, acceptă termenii și urmează pașii operatorului. Verifică <span className="font-medium">termenii</span> (depunere minimă, WR, valabilitate) înainte de a începe.
          </>}
          href="/ghiduri"
        />
        <Item
          icon="⏳"
          q="Ce înseamnă WR?"
          a={<>
            WR (Wagering Requirement) indică <span className="font-medium">rulajul</span> necesar pentru a transforma bonusul în bani reali. Exemplu: WR x30 înseamnă că valoarea bonusului trebuie rulată de 30 de ori.
          </>}
          href="/unelte/calculator-wr"
        />
        <Item
          icon="🎰"
          q="Care sunt cele mai bune oferte fără depunere?"
          a={<>
            Ofertele fără depunere sunt excelente pentru testare, însă verifică mereu <span className="font-medium">valabilitatea</span>, <span className="font-medium">max cashout</span> și <span className="font-medium">sloturile eligibile</span>.
          </>}
          href="/bonusuri-fara-depunere"
        />
      </div>
    </section>
  );
}
