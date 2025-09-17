import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = defaultMetadata({ title: 'GDPR' });

export default function GDPRPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'AcasÃƒâ€žÃ†â€™', url: absoluteUrl('/') },
          { name: 'GDPR', url: absoluteUrl('/gdpr') }
        ])}
      />
      <h1 className="text-2xl font-semibold">GDPR</h1>
      <p>InformaÃƒË†Ã¢â‚¬Âºii privind protecÃƒË†Ã¢â‚¬Âºia datelor cu caracter personal vor fi publicate ÃƒÆ’Ã‚Â®n curÃƒÆ’Ã‚Â¢nd.</p>
      <p>Vom explica scopurile prelucrÃƒâ€žÃ†â€™rii, temeiurile ÃƒË†Ã¢â€žÂ¢i drepturile tale.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
