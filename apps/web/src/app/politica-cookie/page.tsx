export const dynamic = 'force-dynamic';
export const revalidate = 60;

import type { Metadata } from 'next';
import { absoluteUrl, defaultMetadata, jsonLdBreadcrumb } from '@bonusmax/lib';
import BackHome from '@/components/BackHome';

export const metadata: Metadata = defaultMetadata({
  title: 'Politica de Cookie-uri',
  description:
    'Află cum folosim cookie-urile: tipuri, scop, control și preferințe. Poți modifica oricând setările din browser.',
  alternates: { canonical: absoluteUrl('/politica-cookie') },
});

const lastUpdated = '2025-09-01';

export default function Page() {
  const breadcrumbLd = jsonLdBreadcrumb([
    { name: 'Acasă', url: absoluteUrl('/') },
    { name: 'Politica de Cookie-uri', url: absoluteUrl('/politica-cookie') },
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header>
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-neutral-700 dark:text-zinc-300 border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          Politici
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Politica de Cookie-uri</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-700 dark:text-zinc-200">
          Această pagină explică ce sunt cookie-urile, cum le folosim și cum îți poți gestiona preferințele.
        </p>
        <div className="mt-2 text-xs text-neutral-600 dark:text-zinc-400">Ultima actualizare: {new Date(lastUpdated).toLocaleDateString('ro-RO')}</div>
      </header>

      <BackHome />

      <article className="prose max-w-none prose-neutral dark:prose-invert">
        <h2>Ce sunt cookie-urile?</h2>
        <p>
          Cookie-urile sunt fișiere mici de text stocate pe dispozitivul tău atunci când vizitezi un site web. Ele
          ajută site-ul să-ți rețină preferințele și să îmbunătățească funcționalitatea.
        </p>

        <h2>Tipuri de cookie-uri folosite</h2>
        <ul>
          <li><strong>Necesare</strong>: pentru funcționarea de bază a site-ului (autentificare, preferințe de limbă).</li>
          <li><strong>Analitice</strong>: pentru măsurarea traficului și a performanței (ex. Vercel Analytics/Speed Insights).</li>
          <li><strong>Marketing</strong>: pentru conținut și oferte personalizate, acolo unde este cazul.</li>
        </ul>

        <h2>Gestionarea preferințelor</h2>
        <p>
          Poți controla și șterge cookie-urile din setările browserului. Reține că blocarea anumitor cookie-uri poate
          afecta funcționalități ale site-ului.
        </p>

        <h2>Contact</h2>
        <p>
          Întrebări despre cookie-uri? Scrie-ne la <a href="mailto:contact@bonusmax.ro">contact@bonusmax.ro</a> sau vezi
          <a href="/politica-confidentialitate"> Politica de confidențialitate</a>.
        </p>
      </article>
    </main>
  );
}
