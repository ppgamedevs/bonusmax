export const dynamic = 'force-dynamic';
export const revalidate = 60;

import type { Metadata } from 'next';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import BackHome from '@/components/BackHome';

export const metadata: Metadata = defaultMetadata({
  title: 'Politica de confidențialitate',
  description:
    'Află ce date colectăm, în ce scop, temeiul legal și cum îți poți exercita drepturile (GDPR).',
  alternates: { canonical: absoluteUrl('/politica-confidentialitate') },
});

const sections = [
  { id: 'colectare', title: 'Ce date colectăm' },
  { id: 'scopuri', title: 'Scopuri & temei legal' },
  { id: 'drepturi', title: 'Drepturile tale' },
  { id: 'retentie', title: 'Păstrarea datelor' },
  { id: 'securitate', title: 'Securitate' },
  { id: 'contact', title: 'Contact' },
];

const lastUpdated = '2025-09-01';

export default function Page() {
  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Politica de confidențialitate', url: absoluteUrl('/politica-confidentialitate') },
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <header className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          Protecția datelor • GDPR
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Politica de confidențialitate</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">
          Îți respectăm intimitatea și prelucrăm datele conform GDPR. Mai jos găsești un rezumat clar
          al categoriilor de date, scopurilor și drepturilor tale.
        </p>
        <div className="mt-3 text-xs text-zinc-400">Ultima actualizare: {new Date(lastUpdated).toLocaleDateString('ro-RO')}</div>
      </header>

      <BackHome />

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        {/* TOC */}
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

        {/* Content */}
        <article className="prose prose-invert max-w-none">
          <section id="colectare">
            <h2>Ce date colectăm</h2>
            <ul>
              <li>
                <strong>Date de contact</strong> (nume, email, telefon) furnizate voluntar prin formulare.
              </li>
              <li>
                <strong>Date tehnice</strong> și de utilizare (ex. adresa IP abreviată/anonimizată, tip dispozitiv,
                pagini vizitate) pentru securitate și analiză agregată.
              </li>
              <li>
                <strong>Preferințe</strong> (temă, setări, opțiuni de notificare) salvate local în browser.
              </li>
            </ul>
          </section>

          <section id="scopuri">
            <h2>Scopuri & temei legal</h2>
            <ul>
              <li><strong>Furnizarea serviciului</strong> – interes legitim.</li>
              <li><strong>Comunicări și suport</strong> – consimțământ sau executarea contractului.</li>
              <li><strong>Analiză și îmbunătățiri</strong> – interes legitim (date agregate/anonimizate).</li>
              <li><strong>Conformitate legală</strong> – obligații legale (ex. răspuns la solicitări).</li>
            </ul>
          </section>

          <section id="drepturi">
            <h2>Drepturile tale</h2>
            <p>
              Poți solicita acces, rectificare, ștergere, restricționare, portabilitate sau opoziție.
              Pentru a-ți exercita drepturile, <a href="/contact">contactează-ne</a> și vom răspunde în cel mult 30 de zile.
            </p>
          </section>

          <section id="retentie">
            <h2>Păstrarea datelor</h2>
            <p>
              Păstrăm datele doar cât este necesar scopului declarat sau cât impune legea, după care le ștergem
              sau le anonimizăm ireversibil.
            </p>
          </section>

          <section id="securitate">
            <h2>Securitate</h2>
            <ul>
              <li>Criptare în tranzit (HTTPS) și acces limitat la infrastructură.</li>
              <li>Audit periodic al permisiunilor și jurnalizare.</li>
              <li>Minimizarea datelor și principiul „need-to-know”.</li>
            </ul>
          </section>

          <section id="contact">
            <h2>Contact</h2>
            <p>
              Întrebări despre confidențialitate? Scrie-ne la <a href="mailto:contact@bonusmax.ro">contact@bonusmax.ro</a>
              sau folosește pagina de <a href="/contact">contact</a>.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
