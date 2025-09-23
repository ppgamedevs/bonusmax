'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCompareIds } from '@/lib/compare';

export default function PopulateFromLocal() {
  const router = useRouter();
  useEffect(() => {
    try {
      const ids = getCompareIds();
      if (ids && ids.length > 0) {
        router.replace(`/compare?ids=${encodeURIComponent(ids.join(','))}`);
      }
    } catch {}
  }, [router]);
  return null;
}
