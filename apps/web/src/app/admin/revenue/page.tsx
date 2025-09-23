export const dynamic = 'force-dynamic';
export const revalidate = 60;
import { Suspense } from 'react';
import RevenueClient from './RevenueClient';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RevenueClient />
    </Suspense>
  );
}
