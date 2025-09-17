"use client";
import { useEffect, useState } from "react";
import { ensureSessionIdClient } from "../../lib/experiments";

export default function ExitIntent({
  variant,
  path,
  ctaHref,
  delayMs = 10000,
}: {
  variant: "A" | "B";
  path: string;
  ctaHref: string;
  delayMs?: number;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (variant !== "B") return; // A=OFF
    let armed = false,
      t: any = setTimeout(() => (armed = true), delayMs);
    const onMouse = (e: MouseEvent) => {
      if (!armed || open) return;
      if (e.clientY <= 0 || e.clientY < 10) {
        setOpen(true);
        ping();
      }
    };
    window.addEventListener("mouseout", onMouse);
    return () => {
      window.removeEventListener("mouseout", onMouse);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, open, delayMs]);

  function ping() {
    const sid = ensureSessionIdClient();
    fetch("/api/ui/impression", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ component: "exit_modal", experimentKey: "EXIT_INTENT_V1", variant, path, sessionId: sid }),
      keepalive: true,
    }).catch(() => {});
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-[92%] max-w-md rounded-2xl border bg-white p-5 shadow-xl">
        <div className="text-lg font-semibold">Pleci? Uite un bonus popular Ã¢â€ â€œ</div>
        <p className="mt-1 text-sm opacity-80">Operator licenÃˆâ€ºiat ONJN. CiteÃˆâ„¢te termenii ÃƒÂ®nainte de a juca.</p>
        <a href={ctaHref} className="mt-3 inline-block rounded-lg border px-4 py-2 font-semibold underline">
          Deschide oferta
        </a>
        <p className="mt-2 text-xs opacity-60">ConÃˆâ€ºinut comercial Ã¢â‚¬Â¢ 18+ JoacÃ„Æ’ responsabil.</p>
        <button onClick={() => setOpen(false)} className="mt-3 text-xs underline">
          ÃƒÅ½nchide
        </button>
      </div>
    </div>
  );
}
