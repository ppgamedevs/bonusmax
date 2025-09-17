"use client";
import { useEffect, useState } from "react";

export default function TrustBarMobile() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth > 768) return; // doar mobil/tablet mic
    const k = "bm_trustbar_hidden";
    const hidden = localStorage.getItem(k);
    if (!hidden) setShow(true);
  }, []);
  if (!show) return null;

  function hide() {
    try { localStorage.setItem("bm_trustbar_hidden", "1"); } catch {}
    setShow(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),12px)] z-40 mx-3 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 text-white backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <span className="text-[11px] whitespace-nowrap rounded bg-emerald-500/20 px-2 py-0.5 font-medium text-emerald-300">ONJN</span>
        <p className="flex-1 text-[12px] leading-tight opacity-90">
          Doar operatori licențiați. „Sponsored” marcat. 18+ Joacă responsabil.
        </p>
        <a href="/onjn/operatori-licentiati" className="text-[12px] underline">Află mai mult</a>
        <button onClick={hide} aria-label="Închide" className="ml-1 rounded px-1 text-[12px] opacity-75 hover:opacity-100">×</button>
      </div>
    </div>
  );
}
