'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getVariant, ctaLabel } from '../lib/ab';

export default function StickyCTA({ offerId }: { offerId: string }) {
  const [visible, setVisible] = useState(false);
  const ab = getVariant('cta', ['A', 'B']);
  const label = ctaLabel(ab);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 block md:hidden transition ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-screen-md px-4 pb-2">
        <Link
          href={`/go/${offerId}?ab=${ab}`}
          rel="nofollow sponsored"
          className="block w-full rounded-xl border bg-white px-5 py-3 text-center text-base font-semibold shadow-md dark:bg-neutral-900 focus-visible:outline focus-visible:outline-2"
        >
          {label}
          <span className="ml-2 text-xs opacity-60">18+ · Publicitate</span>
        </Link>
      </div>
    </div>
  );
}
