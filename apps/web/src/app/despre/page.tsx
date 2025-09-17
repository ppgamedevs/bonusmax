import { defaultMetadata, absoluteUrl, jsonLdBreadcrumb } from '@bonusmax/lib/seo';
import JsonLd from '../../components/JsonLd';

export const metadata = defaultMetadata({ title: 'Despre' });

export default function DesprePage() {
  const lastUpdated = new Date().toLocaleDateString('ro-RO');
  return (
    <section className="space-y-4">
      <JsonLd
        data={jsonLdBreadcrumb([
          { name: 'AcasÃ„Æ’', url: absoluteUrl('/') },
          { name: 'Despre', url: absoluteUrl('/despre') }
        ])}
      />
      <h1 className="text-2xl font-semibold">Despre</h1>
      <p>Bonusmax este un proiect dedicat comparÃ„Æ’rii bonusurilor de casino Ãˆâ„¢i pariuri din RomÃƒÂ¢nia.</p>
      <p>Ne propunem sÃ„Æ’ agregÃ„Æ’m oferte, sÃ„Æ’ explicÃ„Æ’m condiÃˆâ€ºiile Ãˆâ„¢i sÃ„Æ’ te ghidÃ„Æ’m cÃ„Æ’tre bonusuri potrivite Ãˆâ€ºie.</p>
      <p className="text-sm text-muted-foreground">Ultima actualizare: {lastUpdated}</p>
    </section>
  );
}
