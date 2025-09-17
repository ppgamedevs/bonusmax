"use client";
import { useEffect, useRef, useState } from "react";

export default function HydrateOnVisible({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHydrated(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref}>{hydrated ? children : null}</div>;
}
