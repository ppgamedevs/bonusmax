import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = defaultMetadata({ title: 'Despre' });

export default function DesprePage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'AcasÃƒâ€žÃ†â€™', url: absoluteUrl('/') },
          { name: 'Despre', url: absoluteUrl('/despre') }
        ])}
      />
      <h1 className="text-2xl font-semibold">Despre</h1>
      <p>Bonusmax este un proiect dedicat comparÃƒâ€žÃ†â€™rii bonusurilor de casino ÃƒË†Ã¢â€žÂ¢i pariuri din RomÃƒÆ’Ã‚Â¢nia.</p>
      <p>Ne propunem sÃƒâ€žÃ†â€™ agregÃƒâ€žÃ†â€™m oferte, sÃƒâ€žÃ†â€™ explicÃƒâ€žÃ†â€™m condiÃƒË†Ã¢â‚¬Âºiile ÃƒË†Ã¢â€žÂ¢i sÃƒâ€žÃ†â€™ te ghidÃƒâ€žÃ†â€™m cÃƒâ€žÃ†â€™tre bonusuri potrivite ÃƒË†Ã¢â‚¬Âºie.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
