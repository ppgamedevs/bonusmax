export default function OfferCardServer({
  id,
  brand,
  logoUrl,
  title,
  terms,
  isLicensed,
  isSponsored,
  ctaHref,
  bullets = [],
  className,
  heroImageUrl,
  wr,
  minDeposit,
  days,
  spins,
}: {
  id: string;
  brand: string;
  logoUrl?: string | null;
  title: string;
  terms: string;
  isLicensed: boolean;
  isSponsored?: boolean;
  ctaHref: string;
  bullets?: string[];
  className?: string;
  heroImageUrl?: string | null;
  wr?: number | string | null;
  minDeposit?: number | string | null;
  days?: number | string | null;
  spins?: number | string | null;
}) {
  return (
    <div
      className={
        'group relative flex h-full flex-col justify-between rounded-2xl p-4 shadow-sm ring-1 will-change-transform overflow-hidden ' +
        'bg-white/80 border-neutral-200 ring-neutral-200/50 dark:bg-white/5 dark:border-white/10 dark:ring-white/10 ' +
        (className || '')
      }
      style={{ minHeight: 320, contentVisibility: 'auto' as any, containIntrinsicSize: '320px' }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-white/10 transition-opacity duration-200 group-hover:opacity-100" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
        style={{
          backgroundImage: heroImageUrl
            ? `url(${heroImageUrl})`
            : 'radial-gradient(800px 400px at 120% 120%, rgba(255,255,255,0.5), transparent 60%), radial-gradient(400px 300px at -20% -20%, rgba(255,255,255,0.4), transparent 60%)',
          backgroundSize: heroImageUrl ? 'cover' : 'auto',
          backgroundPosition: 'center',
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-2">
        {isLicensed && <span className="chip-accent pointer-events-auto">Licențiat ONJN</span>}
        {isSponsored && <span className="chip-accent pointer-events-auto">Sponsored</span>}
      </div>

      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-black/5 ring-1 ring-black/10 dark:bg-black/40 dark:ring-white/10">
          {logoUrl ? (
            // Using standard img with loading="lazy" for better performance
            <img 
              src={logoUrl} 
              alt={`Logo ${brand}`} 
              width={40} 
              height={40} 
              className="object-contain" 
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-6 w-6 rounded bg-neutral-300 dark:bg-white/10" aria-hidden />
          )}
        </div>
        <div className="text-sm font-semibold tracking-wide text-neutral-800 opacity-90 dark:text-neutral-100">
          {brand}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <h3 className="text-lg font-extrabold leading-snug text-neutral-900 dark:text-neutral-50">{title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{terms}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-300">
          {wr != null && wr !== '' && <span>🎰 WR: {typeof wr === 'number' ? `x${wr}` : wr}</span>}
          {minDeposit != null && minDeposit !== '' && (
            <span>💳 Min dep: {typeof minDeposit === 'number' ? `${minDeposit} RON` : minDeposit}</span>
          )}
          {days != null && days !== '' && <span>⏳ {days} zile</span>}
          {spins != null && spins !== '' && <span>🎯 {spins} Rotiri</span>}
        </div>
        {bullets.length > 0 && (
          <ul className="mt-1 list-disc pl-5 text-sm text-neutral-600 dark:text-neutral-300">
            {bullets.slice(0, 2).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <a
          href={ctaHref}
          aria-label="Revendică bonusul (Conținut comercial, 18+)"
          className="btn-accent h-11 w-full focus-accent relative overflow-hidden"
          rel="nofollow sponsored noopener"
        >
          Revendică bonusul
        </a>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">18+ • T&C • Publicitate</p>
          {/* Compare toggle intentionally omitted in server version */}
        </div>
      </div>
    </div>
  );
}
