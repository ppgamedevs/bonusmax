"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";

export type OfferCardProps = {
  id: string;
  brand: string;
  logoUrl?: string | null;
  title: string;
  terms: string;
  isLicensed: boolean;
  isSponsored?: boolean;
  ctaHref: string;
  onCompareToggle?: () => void;
  inCompare?: boolean;
  bullets?: string[];
  className?: string;
  heroImageUrl?: string | null; // decorative background image
  wr?: number | string | null;
  minDeposit?: number | string | null;
  days?: number | string | null;
  spins?: number | string | null;
};

export default function OfferCard({
  brand,
  logoUrl,
  title,
  terms,
  isLicensed,
  isSponsored,
  ctaHref,
  onCompareToggle,
  inCompare,
  bullets = [],
  className,
  heroImageUrl,
  wr,
  minDeposit,
  days,
  spins,
}: OfferCardProps) {
  const r = useReducedMotion();

  function handleRipple(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const span = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    span.style.position = "absolute";
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    span.style.width = span.style.height = `${size}px`;
    span.style.borderRadius = "9999px";
    span.style.background = "rgba(255,255,255,0.25)";
    span.style.transform = "scale(0)";
    span.style.opacity = "0.7";
    span.style.pointerEvents = "none";
    span.style.transition = "transform 400ms ease, opacity 600ms ease";
    el.appendChild(span);
    requestAnimationFrame(() => {
      span.style.transform = "scale(1)";
      span.style.opacity = "0";
    });
    setTimeout(() => span.remove(), 650);
  }

  function WRTooltip() {
    const tip = "WR (Wagering Requirement): rulajul necesar pentru a transforma bonusul în bani reali.";
    return (
      <span className="relative inline-block">
        <span className="underline decoration-dotted cursor-help" aria-label={tip} title={tip}>WR</span>
      </span>
    );
  }

  return (
    <motion.div
      whileHover={r ? undefined : { y: -2, scale: 1.01, rotateX: 0.5, rotateY: -0.5 }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.3 }}
      className={clsx(
        "group relative flex h-full flex-col justify-between rounded-2xl p-4 shadow-sm ring-1 will-change-transform overflow-hidden",
        // dark matte base + subtle border
        "bg-neutral-950/70 border-white/10 ring-white/10 dark:bg-white/5 dark:border-white/10 dark:ring-white/10",
        // light theme refinement
        "bg-white/80 border-neutral-200 ring-neutral-200/50",
        className
      )}
    >
      {/* hover shader subtil */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-white/10 transition-opacity duration-200 group-hover:opacity-100" />
      {/* Decorative hero background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
        style={{
          backgroundImage: heroImageUrl
            ? `url(${heroImageUrl})`
            : "radial-gradient(800px 400px at 120% 120%, rgba(255,255,255,0.5), transparent 60%), radial-gradient(400px 300px at -20% -20%, rgba(255,255,255,0.4), transparent 60%)",
          backgroundSize: heroImageUrl ? "cover" : "auto",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      {/* Badge-uri dreapta-sus */}
      <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-2">
        {isLicensed && (
          <span className="chip-accent pointer-events-auto">
            Licențiat ONJN
          </span>
        )}
        {isSponsored && (
          <span className="chip-accent pointer-events-auto">
            Sponsored
          </span>
        )}
      </div>

      {/* Top: logo + brand */}
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-black/5 ring-1 ring-black/10 dark:bg-black/40 dark:ring-white/10">
          {logoUrl ? (
            <Image src={logoUrl} alt={`Logo ${brand}`} width={40} height={40} className="object-contain" />
          ) : (
            <div className="h-6 w-6 rounded bg-neutral-300 dark:bg-white/10" aria-hidden />
          )}
        </div>
        <div className="text-sm font-semibold tracking-wide text-neutral-800 opacity-90 dark:text-neutral-100">
          {brand}
        </div>
      </div>

      {/* Conținut */}
      <div className="mt-3 space-y-2">
        <h3 className="text-lg font-extrabold leading-snug text-neutral-900 dark:text-neutral-50">{title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{terms}</p>
        {/* Secondary info with icons */}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-300">
          {(wr ?? null) && (
            <span title="Wagering Requirement">
              💰 <WRTooltip />: {typeof wr === "number" ? `x${wr}` : wr}
            </span>
          )}
          {(minDeposit ?? null) && (
            <span>💳 Min dep: {typeof minDeposit === "number" ? `${minDeposit} RON` : minDeposit}</span>
          )}
          {(days ?? null) && <span>⏳ {days} zile</span>}
          {(spins ?? null) && <span>🎰 {spins} Rotiri</span>}
        </div>
        {bullets.length > 0 && (
          <ul className="mt-1 list-disc pl-5 text-sm text-neutral-600 dark:text-neutral-300">
            {bullets.slice(0, 2).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom: CTA + secundare */}
      <div className="mt-4">
        <Link
          href={ctaHref as any}
          aria-label="Revendică bonusul (Conținut comercial, 18+)"
          className="btn-accent h-11 w-full focus-accent relative overflow-hidden"
          onMouseDown={handleRipple}
          rel="nofollow sponsored noopener"
        >
          Revendică bonusul
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">18+ • T&C • Publicitate</p>
          {onCompareToggle && (
            <button
              type="button"
              aria-pressed={!!inCompare}
              aria-label={inCompare ? "Elimină din comparație" : "Adaugă la comparație"}
              role="checkbox"
              aria-checked={!!inCompare}
              className="inline-flex items-center gap-1 text-[12px] underline text-neutral-700 hover:opacity-100 dark:text-neutral-200 focus-accent"
              onClick={onCompareToggle}
            >
              <span
                className={"grid h-3.5 w-3.5 place-items-center rounded border " + (inCompare ? "bg-white/80 text-black" : "border-white/50")}
                aria-hidden
              >
                {inCompare ? "✓" : ""}
              </span>
              {inCompare ? "În listă" : "Compara"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function OfferCardSkeleton() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 dark:bg-white/5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-white/10" />
        <div className="h-4 w-28 rounded bg-white/10" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-5 w-3/4 rounded bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
      </div>
      <div className="mt-6 h-11 w-full rounded-xl bg-white/10" />
      <div className="mt-2 h-3 w-32 rounded bg-white/10" />
      <div className="shimmer absolute inset-0" aria-hidden />
    </div>
  );
}
