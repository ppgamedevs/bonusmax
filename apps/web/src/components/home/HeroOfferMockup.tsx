"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";

function RippleButton(props: React.ComponentProps<typeof Link>) {
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
  return (
    <Link {...props} onMouseDown={(e) => { handleRipple(e); props.onMouseDown?.(e); }} className={(props.className || "") + " btn-accent focus-accent relative overflow-hidden"} />
  );
}

export default function HeroOfferMockup({
  brand = "Betano",
  logoUrl = "/logos/betano.png",
  headline = "600 RON Bonus + 50 Rotiri",
  wr = "x30",
  days = 7,
  minDeposit = 20,
  ctaHref = "/go/betano",
  stadiumUrl = "/images/stadium.jpg",
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
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useTransform(mx, [-1, 1], ["48%", "52%"]);
  const bgY = useTransform(my, [-1, 1], ["52%", "48%"]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; // 0..1
    const y = (e.clientY - r.top) / r.height; // 0..1
    mx.set(x * 2 - 1);
    my.set(y * 2 - 1);
  }

  return (
    <motion.section
      id="hero-offer"
      className="mx-auto mt-4 max-w-6xl px-4"
      onMouseMove={onMouseMove}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-neutral-950/80 p-5 shadow-xl ring-1 ring-white/10 dark:bg-neutral-900/70">
        {/* Soft gradient blend with Betano orange */}
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen" style={{
          background: "radial-gradient(800px 400px at 20% 20%, rgba(255,102,0,0.5), transparent 60%), linear-gradient(90deg, rgba(255,102,0,0.2), rgba(139,92,246,0.18))"
        }} />
        {/* Stadium background (subtle) */}
        <motion.div
          style={{ backgroundPosition: `${bgX.get()} ${bgY.get()}` }}
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                `url(${stadiumUrl}), radial-gradient(1000px 600px at 80% 10%, rgba(255,255,255,0.18), transparent 60%)`,
              backgroundSize: "cover, auto",
              backgroundPosition: "center",
            }}
          />
        </motion.div>

        <div className="relative z-10 flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-black/20 ring-1 ring-white/15">
            <Image src={logoUrl || "/logos/betano.png"} alt={brand} width={40} height={40} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-white/80">{brand} Ã¢â‚¬Â¢ Recomandat</div>
            <h3 className="mt-1 text-3xl font-extrabold text-white">{headline}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/90">
              {wr && <span>Ã°Å¸â€™Â° WR {typeof wr === 'number' ? `x${wr}` : wr}</span>}
              {days && <span>Ã¢ÂÂ³ {days} zile</span>}
              {minDeposit && <span>Ã°Å¸â€™Â³ Min dep {minDeposit} RON</span>}
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-4 flex items-center gap-3">
          <RippleButton href={ctaHref} aria-label={`RevendicÃ„Æ’ bonusul ${brand}`} className="btn-accent h-12 px-6 text-base">
            RevendicÃ„Æ’ bonusul
          </RippleButton>
          <span className="chip-accent">LicenÃˆâ€ºiat ONJN</span>
        </div>
      </div>
      <div className="mt-1 text-[11px] opacity-70">Exemplu ilustrativ pentru prezentare Ã¢â‚¬Â¢ 18+ JoacÃ„Æ’ responsabil Ã¢â‚¬Â¢ Publicitate</div>
    </motion.section>
  );
}
