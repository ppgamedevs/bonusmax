"use client";
import { useEffect, useState } from "react";
import { ensureSessionIdClient } from "../../lib/experiments";

export default function StickyBar({
  variant,
  path,
  ctaHref,
}: { variant: "A" | "B"; path: string; ctaHref: string }) {
  if (variant !== "B") return null;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    setShown(true);
    const sid = ensureSessionIdClient();
    fetch("/api/ui/impression", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        component: "sticky_bar",
        experimentKey: "STICKY_BAR_V1",
        variant,
        path,
        sessionId: sid,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [shown, variant, path]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <div className="text-sm">
          <span className="font-semibold">Oferte licenÃˆâ€ºiate ONJN</span>
          <span className="ml-2 opacity-70">Ã¢â‚¬â€ vezi bonusurile actuale</span>
          <span className="ml-3 text-[11px] opacity-60">ConÃˆâ€ºinut comercial Ã¢â‚¬Â¢ 18+ JoacÃ„Æ’ responsabil.</span>
        </div>
        <a href={ctaHref} className="rounded-lg border px-4 py-2 text-sm font-semibold underline">
          Vezi bonusul
        </a>
      </div>
    </div>
  );
}
