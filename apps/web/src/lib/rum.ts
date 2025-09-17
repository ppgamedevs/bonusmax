"use client";
import { onLCP, onCLS, onINP, onTTFB } from "web-vitals";

type Metric = { name: string; value: number; id: string };

function post(metric: Metric) {
  try {
    const payload = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      url: window.location.pathname + window.location.search,
    };
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/i/rum", blob);
    } else {
      fetch("/i/rum", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
    }
  } catch {}
}

export function initRUM() {
  onLCP(post);
  onCLS(post);
  onINP(post);
  onTTFB(post);
}
