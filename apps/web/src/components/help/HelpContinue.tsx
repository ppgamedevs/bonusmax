"use client";

import { useEffect, useState } from "react";

export default function HelpContinue() {
  const [href, setHref] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("help:last");
      if (!raw) return;
      const v = JSON.parse(raw) as { href: string; title: string };
      if (v?.href) {
        setHref(v.href);
        setTitle(v.title || v.href);
      }
    } catch {}
  }, []);

  if (!href) return null;

  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
      Continuă de unde ai rămas:
      <a href={href} className="underline underline-offset-2">
        {title}
      </a>
    </div>
  );
}
