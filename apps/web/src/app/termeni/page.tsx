import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '../../components/JsonLd';

export const metadata = defaultMetadata({ title: 'Termeni și Condiții' });

export default function TermeniPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'Acasă', url: absoluteUrl('/') },
          { name: 'Termeni și Condiții', url: absoluteUrl('/termeni') }
        ])}
      />
      <h1 className="text-2xl font-semibold">Termeni și Condiții</h1>
      <p>Acesta este un rezumat al termenilor și condițiilor. Versiunea completă va fi disponibilă curând.</p>
      <p>Te rugăm să verifici periodic această pagină pentru actualizări.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
