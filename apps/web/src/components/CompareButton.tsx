"use client";
import { useEffect, useState } from "react";
import { getCompareIds, toggleCompare } from "../lib/compare";

export default function CompareButton({ id, initialInCompare }: { id: string; initialInCompare?: boolean }) {
  const [chosen, setChosen] = useState<string[]>([]);
  useEffect(() => {
    const load = () => setChosen(getCompareIds());
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);
  const inCompare = chosen.includes(id);
  return (
    <button
      type="button"
      onClick={() => setChosen(toggleCompare(id))}
      className="ml-2 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs focus-visible:outline focus-visible:outline-2"
      aria-pressed={inCompare}
    >
      {inCompare ? "În listă" : "Compara"}
    </button>
  );
}
