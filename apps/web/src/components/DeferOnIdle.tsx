'use client';

import { PropsWithChildren, useEffect, useState } from 'react';

/**
 * Defer rendering children until the browser is idle (or after a timeout fallback).
 * This reduces main-thread work during FCP/LCP for non-critical UI.
 */
export default function DeferOnIdle({ children, timeout = 1500 }: PropsWithChildren<{ timeout?: number }>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let t: any;
    const onReady = () => setReady(true);
    // @ts-ignore - requestIdleCallback may not exist in TS lib
    const ric: any = (window as any).requestIdleCallback;
    if (typeof ric === 'function') {
      ric(onReady, { timeout });
    } else {
      t = setTimeout(onReady, timeout);
    }
    return () => clearTimeout(t);
  }, [timeout]);

  if (!ready) return null;
  return <>{children}</>;
}
