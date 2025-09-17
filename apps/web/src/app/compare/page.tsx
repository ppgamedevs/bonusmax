import Link from 'next/link';

export const metadata = { title: 'ComparÄƒ oferte' };

export default function Page() {
  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">ComparÄƒ oferte</h1>

      <div className="mt-2 flex items-center justify-between">
        <a href="#main" className="text-sm underline">ÃŽnapoi sus</a>
        <Link href="/" className="text-sm underline">AcasÄƒ</Link>
      </div>
    </main>
  );
}