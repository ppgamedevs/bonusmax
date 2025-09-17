"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyHeader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (y > 96 && last <= 96) setShow(true);
      if (y <= 24 && last > 24) setShow(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-40 transition-all duration-300",
        show ? "opacity-100" : "opacity-0 -translate-y-2",
      ].join(" ")}
      aria-hidden={!show}
    >
      <div className="mx-auto max-w-[1100px] px-3">
        <div className="pointer-events-auto mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/70 px-3 py-2 backdrop-blur dark:bg-black/40">
          <Link href="/" className="text-sm font-semibold tracking-tight hover:underline">
            Bonusmax
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-xs opacity-75">Operatori licențiați ONJN • 18+</span>
          </div>
          <Link
            href="#topul-de-azi"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-white/20 px-3 text-sm font-semibold underline hover:bg-white/20 md:hidden"
          >
            Vezi topul de azi
          </Link>
        </div>
      </div>
    </div>
  );
}
