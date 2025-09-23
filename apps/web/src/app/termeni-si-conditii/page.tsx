export const dynamic = 'force-dynamic';
export const revalidate = 60;

import type { Metadata } from 'next';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';

export const metadata: Metadata = defaultMetadata({
  title: 'Termeni și condiții',
  description:
    'Citește termenii de utilizare Bonusmax: eligibilitate, utilizarea conținutului, limitarea răspunderii și contact.',
  alternates: { canonical: absoluteUrl('/termeni-si-conditii') },
});

const sections = [
  { id: 'acceptare', title: 'Acceptarea termenilor' },
  { id: 'eligibilitate', title: 'Eligibilitate' },
  { id: 'utilizare', title: 'Utilizarea site-ului' },
  { id: 'continut', title: 'Conținut & proprietate' },
  { id: 'responsabilitate', title: 'Limitarea răspunderii' },
  { id: 'modificari', title: 'Modificări' },
  { id: 'contact', title: 'Contact' },
];

const lastUpdated = '2025-09-01';

export default function Page() {
  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Termeni și condiții', url: absoluteUrl('/termeni-si-conditii') },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <header className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" aria-hidden />
          Termeni de utilizare
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Termeni și condiții</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          Te rugăm să citești cu atenție acești termeni. Accesarea și folosirea site-ului implică
          acceptarea lor.
        </p>
        <div className="mt-3 text-xs text-zinc-400">Ultima actualizare: {new Date(lastUpdated).toLocaleDateString('ro-RO')}</div>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <nav className="hidden md:block">
          <div className="sticky top-24 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
            <div className="px-1 text-xs font-semibold uppercase tracking-wide opacity-70">Cuprins</div>
            <ul className="mt-2 space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a className="block rounded px-2 py-1 text-zinc-300 hover:bg-white/10" href={`#${s.id}`}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <article className="prose prose-invert max-w-none">
          <section id="acceptare">
            <h2>Acceptarea termenilor</h2>
            <p>
              Folosind site-ul Bonusmax, confirmi că ai citit și accepți acești termeni. Dacă nu ești de
              acord, te rugăm să nu folosești site-ul.
            </p>
          </section>

          <section id="eligibilitate">
            <h2>Eligibilitate</h2>
            <ul>
              <li>Site-ul este destinat exclusiv persoanelor de 18+.</li>
              <li>Promovăm doar operatori licențiați ONJN în România.</li>
            </ul>
          </section>

          <section id="utilizare">
            <h2>Utilizarea site-ului</h2>
            <ul>
              <li>Conținut comercial. Unele oferte pot fi sponsorizate și marcate corespunzător.</li>
              <li>Nu încurajăm jocurile de noroc nerezponsabile. Joacă responsabil.</li>
              <li>Respectă legislația aplicabilă și nu folosi site-ul în scopuri ilicite.</li>
            </ul>
          </section>

          <section id="continut">
            <h2>Conținut & proprietate</h2>
            <p>
              Textele, elementele vizuale și structura site-ului sunt protejate de drepturi de autor.
              Poți folosi conținutul în scop personal, non-comercial, cu citarea sursei. Reproducerea
              sau redistribuirea conținutului fără acord prealabil este interzisă.
            </p>
          </section>

          <section id="responsabilitate">
            <h2>Limitarea răspunderii</h2>
            <p>
              Bonusmax nu este operator de jocuri de noroc și nu garantează rezultatele campaniilor.
              Nu răspundem pentru erori, întârzieri sau informații furnizate de terți. Verifică mereu
              termenii operatorilor înainte de a participa la promoții.
            </p>
          </section>

          <section id="modificari">
            <h2>Modificări</h2>
            <p>
              Putem actualiza termenii periodic. Versiunea curentă va fi publicată pe această pagină,
              cu data ultimei actualizări.
            </p>
          </section>

          <section id="contact">
            <h2>Contact</h2>
            <p>
              Întrebări despre termeni? Scrie-ne la <a href="mailto:contact@bonusmax.ro">contact@bonusmax.ro</a>
              sau vizitează pagina de <a href="/contact">contact</a>.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
