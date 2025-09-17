export const metadata = { title: 'Politica de confidențialitate | Bonusmax' };

export default function Page() {
  return (
    <section className="prose prose-invert mx-auto max-w-3xl px-4">
      <h1>Politica de confidențialitate</h1>
      <p>Protejăm datele tale personale și respectăm legislația aplicabilă (GDPR). Această pagină descrie tipurile de date pe care le colectăm, scopurile, temeiurile și drepturile tale.</p>
      <h2>Date colectate</h2>
      <ul>
        <li>Date de contact trimise în formulare (opțional).</li>
        <li>Date tehnice anonime (ex. analytics, RUM, trafic).</li>
      </ul>
      <h2>Drepturile tale</h2>
      <p>Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție. Pentru exercitare, scrie-ne la <a href="/contact">contact</a>.</p>
    </section>
  );
}
