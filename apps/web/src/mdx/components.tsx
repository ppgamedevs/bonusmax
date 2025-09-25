'use client';
import React from 'react';

function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9ăâîșțĂÂÎȘȚ -]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
export function H2(props: any) {
  const id = slugify(props?.children);
  return <h2 id={id} {...props} />;
}
export function H3(props: any) {
  const id = slugify(props?.children);
  return <h3 id={id} {...props} />;
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-xl border bg-blue-50 p-4 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100">
      {children}
    </div>
  );
}

export function FAQList({ items }: { items?: { q: string; a: string }[] }) {
  return (
    <div className="mt-6 space-y-3">
      {(items ?? []).map((it, i) => (
        <details key={i} className="rounded border p-3">
          <summary className="cursor-pointer font-medium">{it.q}</summary>
          <p className="mt-2 text-sm opacity-90">{it.a}</p>
        </details>
      ))}
    </div>
  );
}

export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      {children}
    </a>
  );
}

const components = { Callout, FAQList, ButtonLink, h2: H2, h3: H3 };
export default components;
