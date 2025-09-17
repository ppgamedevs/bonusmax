import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '../../components/JsonLd';

export const metadata = defaultMetadata({ title: 'Despre' });

export default function DesprePage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'Acasă', url: absoluteUrl('/') },
          { name: 'Despre', url: absoluteUrl('/despre') }
        ])}
      />
      <h1 className="text-2xl font-semibold">Despre</h1>
      <p>Bonusmax este un proiect dedicat comparării bonusurilor de casino și pariuri din România.</p>
      <p>Ne propunem să agregăm oferte, să explicăm condițiile și să te ghidăm către bonusuri potrivite ție.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
