export const dynamic = 'force-dynamic';
export const revalidate = 60;
export const metadata = { title: 'Calculator WR (Wagering Requirement)' };
import CalculatorWRClient from './CalculatorWRClient';
import BackHome from '@/components/BackHome';

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold">Calculator WR (Wagering Requirement)</h1>
      </header>
      <BackHome />
      <div className="mt-4">
        <CalculatorWRClient />
      </div>
    </main>
  );
}
