"use client";
import { useEffect, useState } from "react";
import { getCompareIds } from "../lib/compare";

export default function StickyCtaMobile() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const load = () => setIds(getCompareIds());
    load();
    window.addEventListener("storage", load);
    const i = setInterval(load, 1000);
    return () => { window.removeEventListener("storage", load); clearInterval(i); };
  }, []);

  const hasCompare = ids.length >= 2;

  function onClick() {
    if (hasCompare) {
      location.href = "/compara";
    } else {
      const el = document.getElementById("hero-offer") || document.getElementById("topul-de-azi");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else location.href = "#topul-de-azi";
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 block md:hidden">
      <div className="mx-auto max-w-6xl px-4">
        <button
          type="button"
          onClick={onClick}
          className="btn-accent focus-accent h-12 w-full rounded-2xl"
          aria-label={hasCompare ? "Compară ofertele selectate" : "Revendică bonusul acum"}
        >
          {hasCompare ? "Compară acum" : "Revendică bonusul acum"}
        </button>
      </div>
    </div>
  );
}
