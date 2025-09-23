'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CompareBar, { type CompareItem } from './CompareBar';
import CompareDrawer from './CompareDrawer';
import { getCompareIds, toggleCompare } from '../../lib/compare';

async function fetchItems(ids: string[]): Promise<CompareItem[]> {
  if (ids.length === 0) return [];
  const url = '/api/compare/items?ids=' + encodeURIComponent(ids.join(','));
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items as CompareItem[];
}

export default function CompareUI() {
  const [ids, setIds] = useState<string[]>([]);
  const [items, setItems] = useState<CompareItem[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // keep ids in sync with storage (no polling)
  useEffect(() => {
    const load = () => setIds(getCompareIds());
    load();
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('storage', load);
    };
  }, []);

  // fetch details when ids change
  useEffect(() => {
    fetchItems(ids).then(setItems);
  }, [ids]);

  function remove(id: string) {
    setIds(toggleCompare(id));
  }

  const onCompare = () => {
    if (ids.length === 0) return;
    // new RO route without query; page will fallback from localStorage if needed
    router.push('/compara' as any);
    setOpen(false);
  };

  return (
    <>
      <CompareBar items={items} onOpen={() => setOpen(true)} />
      <CompareDrawer
        open={open}
        items={items}
        onClose={() => setOpen(false)}
        onRemove={remove}
        onCompare={onCompare}
      />
    </>
  );
}
