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

export function Callout({ 
  children, 
  type = 'info', 
  title 
}: { 
  children: React.ReactNode; 
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
}) {
  const typeStyles = {
    info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-100 dark:border-yellow-800',
    success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800',
    error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-100 dark:border-red-800'
  };

  return (
    <div className={`my-4 rounded-xl border p-4 ${typeStyles[type]}`}>
      {title && (
        <div className="font-semibold mb-2">{title}</div>
      )}
      {children}
    </div>
  );
}

// Context for passing FAQs to FAQList component
let currentFAQs: { q: string; a: string }[] = [];

function setFAQsContext(faqs: { q: string; a: string }[]) {
  currentFAQs = faqs;
}

export function FAQList({ items }: { items?: { q: string; a: string }[] }) {
  const faqsToShow = items || currentFAQs;
  
  if (!faqsToShow || faqsToShow.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-semibold mb-3 text-neutral-900 dark:text-white">Întrebări frecvente</h3>
      {faqsToShow.map((it, i) => (
        <details key={i} className="rounded border p-3 border-neutral-200 dark:border-white/10">
          <summary className="cursor-pointer font-medium text-neutral-900 dark:text-white">{it.q}</summary>
          <p className="mt-2 text-sm opacity-90 text-neutral-700 dark:text-neutral-300">{it.a}</p>
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

export function ProsCons({ 
  pros = [], 
  cons = [] 
}: { 
  pros?: string[]; 
  cons?: string[]; 
}) {
  return (
    <div className="my-6 grid gap-4 md:grid-cols-2">
      {pros.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Pro</h4>
          <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">❌ Contra</h4>
          <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const components = { Callout, FAQList, ButtonLink, ProsCons, h2: H2, h3: H3 };
export default components;
export { setFAQsContext };
