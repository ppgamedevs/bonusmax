"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Înapoi sus"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 rounded-full border border-white/20 bg-white/70 p-3 text-black shadow backdrop-blur hover:bg-white/90 dark:border-white/10 dark:bg-neutral-900/80 dark:text-white"
    >
      ↑
    </button>
  );
}
