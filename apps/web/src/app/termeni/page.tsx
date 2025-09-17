import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = defaultMetadata({ title: 'Termeni ÃƒË†Ã¢â€žÂ¢i CondiÃƒË†Ã¢â‚¬Âºii' });

export default function TermeniPage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'AcasÃƒâ€žÃ†â€™', url: absoluteUrl('/') },
          { name: 'Termeni ÃƒË†Ã¢â€žÂ¢i CondiÃƒË†Ã¢â‚¬Âºii', url: absoluteUrl('/termeni') }
        ])}
      />
      <h1 className="text-2xl font-semibold">Termeni ÃƒË†Ã¢â€žÂ¢i CondiÃƒË†Ã¢â‚¬Âºii</h1>
      <p>Acesta este un rezumat al termenilor ÃƒË†Ã¢â€žÂ¢i condiÃƒË†Ã¢â‚¬Âºiilor. Versiunea completÃƒâ€žÃ†â€™ va fi disponibilÃƒâ€žÃ†â€™ curÃƒÆ’Ã‚Â¢nd.</p>
      <p>Te rugÃƒâ€žÃ†â€™m sÃƒâ€žÃ†â€™ verifici periodic aceastÃƒâ€žÃ†â€™ paginÃƒâ€žÃ†â€™ pentru actualizÃƒâ€žÃ†â€™ri.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
