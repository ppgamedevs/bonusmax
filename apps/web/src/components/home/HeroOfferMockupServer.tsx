import Image from 'next/image';
import Link from 'next/link';

export default function HeroOfferMockupServer({
  brand = 'Betano',
  logoUrl = '/logos/betano.png',
  headline = '600 RON Bonus + 50 Rotiri',
  wr = 'x30',
  days = 7,
  minDeposit = 20,
  ctaHref = '/go/betano',
  stadiumUrl = '/images/stadium.jpg',
}: {
  brand?: string;
  logoUrl?: string | null;
  headline?: string;
  wr?: string | number | null;
  days?: string | number | null;
  minDeposit?: string | number | null;
  ctaHref?: any;
  stadiumUrl?: string;
}) {
  return (
    <section id="hero-offer" className="mx-auto mt-4 max-w-6xl px-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-neutral-950/80 p-5 shadow-xl ring-1 ring-white/10 dark:bg-neutral-900/70" style={{ containIntrinsicSize: '380px' as any, contentVisibility: 'auto' as any }}>
        {/* Soft gradient blend */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
          style={{
            background:
              'radial-gradient(800px 400px at 20% 20%, rgba(255,102,0,0.5), transparent 60%), linear-gradient(90deg, rgba(255,102,0,0.2), rgba(139,92,246,0.18))',
          }}
          aria-hidden
        />
        {/* Stadium background (subtle) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden>
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${stadiumUrl}), radial-gradient(1000px 600px at 80% 10%, rgba(255,255,255,0.18), transparent 60%)`,
              backgroundSize: 'cover, auto',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="relative z-10 flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-black/20 ring-1 ring-white/15">
            <Image
              src={logoUrl || '/logos/betano.png'}
              alt={brand}
              width={40}
              height={40}
              sizes="48px"
              priority
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-white/80">{brand} • Recomandat</div>
            <h3 className="mt-1 text-3xl font-extrabold text-white">{headline}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/90">
              {wr && <span>🎰 WR {typeof wr === 'number' ? `x${wr}` : wr}</span>}
              {days && <span>⏳ {days} zile</span>}
              {minDeposit && <span>💳 Min dep {minDeposit} RON</span>}
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-4 flex items-center gap-3">
          <Link href={ctaHref} aria-label={`Revendică bonusul ${brand}`} className="btn-accent h-12 px-6 text-base">
            Revendică bonusul
          </Link>
          <span className="chip-accent">Licențiat ONJN</span>
        </div>
      </div>
      <div className="mt-1 text-[11px] opacity-70">Exemplu ilustrativ pentru prezentare • 18+ Joacă responsabil • Publicitate</div>
    </section>
  );
}
