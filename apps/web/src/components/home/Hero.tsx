import { prisma } from '@bonusmax/lib';
import Link from 'next/link';
import { ShieldCheck, Lock, BadgeAlert } from 'lucide-react';
import { formatUpdatedRO } from '../../lib/datetime';

async function lastUpdated() {
  const row = await (prisma as any).offer.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
    select: { updatedAt: true },
  });
  return (row?.updatedAt as Date) || new Date();
}

export default async function Hero() {
  const updatedAt = await lastUpdated();
  return (
    <section className="container mx-auto px-4 pt-8 pb-6 text-center">
      <p className="text-[13px] opacity-80">
        Doar operatori licențiați ONJN • 18+ Joacă responsabil
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
        <span aria-hidden>⭐ </span>Top <span className="u-accent-text">Bonusuri</span> pentru
        România — <span className="u-underline-hover">Verificate și Actualizate</span>
      </h1>
      <p className="mx-auto mt-2 max-w-2xl text-sm opacity-80">
        Comparație rapidă, termeni clari, linkuri sigure. Unele oferte sunt{' '}
        <span className="font-medium">sponsorizate</span> — le marcăm vizibil.
      </p>
      {/* Urgency indicators */}
      <div className="mt-2 flex items-center justify-center gap-3 text-xs opacity-80">
        <span className="chip-accent">Oferte valabile azi</span>
        <span>Ultima actualizare: {formatUpdatedRO(updatedAt)}</span>
      </div>

      {/* Quick filters */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <a
          href="#trust"
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 focus-accent"
        >
          <ShieldCheck size={16} aria-hidden /> Licențiat ONJN
        </a>
        <a
          href="/bonusuri-fara-depunere"
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 focus-accent"
        >
          Fără Depunere
        </a>
        <a
          href="/rotiri-gratuite"
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 focus-accent"
        >
          Rotiri Gratuite
        </a>
      </div>

      {/* Trust badges inline */}
      <div className="mt-3 flex items-center justify-center gap-4 text-[12px] opacity-80">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck size={14} aria-hidden /> ONJN
        </span>
        <span className="inline-flex items-center gap-1">
          <Lock size={14} aria-hidden /> SSL securizat
        </span>
        <span className="inline-flex items-center gap-1">
          <BadgeAlert size={14} aria-hidden /> 18+ responsabil
        </span>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <Link href="#topul-de-azi" className="btn-accent h-11 px-5 focus-accent">
          Vezi topul de azi
        </Link>
        <Link
          href="/bonusuri-fara-depunere"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 px-5 text-sm font-medium hover:bg-white/10 focus-accent"
        >
          Bonus fără depunere
        </Link>
      </div>
      {/* moved update time above */}
    </section>
  );
}
