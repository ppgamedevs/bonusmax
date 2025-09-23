import Link from 'next/link';

export default function BackHome({ className = '' }: { className?: string }) {
  return (
    <div className={`mt-4 ${className}`}>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
        aria-label="Înapoi la pagina principală"
      >
        <span aria-hidden>←</span>
        <span>Înapoi la Acasă</span>
      </Link>
    </div>
  );
}
