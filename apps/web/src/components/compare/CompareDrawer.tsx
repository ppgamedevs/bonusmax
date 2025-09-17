"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { CompareItem } from "./CompareBar";

export default function CompareDrawer({
  open,
  items,
  onClose,
  onRemove,
  onCompare,
}: {
  open: boolean;
  items: CompareItem[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onCompare: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function onOverlayClick(e: React.MouseEvent) {
    if (e.target === ref.current) onClose();
  }

  return (
    <div
      id="compare-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Comparație oferte"
      className={["fixed inset-0 z-50 transition", open ? "opacity-100" : "pointer-events-none opacity-0"].join(" ")}
    >
      <div ref={ref} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onMouseDown={onOverlayClick} />
      <div
        className={[
          "fixed inset-x-0 bottom-0 mx-auto w-full max-w-[1100px] rounded-t-3xl border border-white/10 bg-white/95 p-4 shadow-2xl dark:bg-neutral-900/95",
          open ? "translate-y-0" : "translate-y-full",
          "translate-y-0 transition-transform duration-300",
        ].join(" ")}
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold">Comparație</h3>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm underline focus-accent">
            Închide
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm opacity-80">Nu ai oferte în listă.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-black/10 dark:bg-white/10">
                  {it.logo ? (
                    <Image src={it.logo} alt="" width={40} height={40} />
                  ) : (
                    <div className="h-6 w-6 rounded bg-white/20" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{it.brand}</div>
                  {it.headline && <div className="truncate text-xs opacity-70">{it.headline}</div>}
                </div>
                <button
                  onClick={() => onRemove(it.id)}
                  aria-label={`Elimină ${it.brand}`}
                  className="rounded border px-2 py-1 text-xs underline hover:bg-white/10"
                >
                  Elimină
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] opacity-60">Compară maximum 4 oferte odată. 18+ • T&C • Publicitate</p>
          <button
            onClick={onCompare}
            disabled={items.length < 2}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold underline disabled:opacity-50 focus-accent"
          >
            Compară acum
          </button>
        </div>
      </div>
    </div>
  );
}
