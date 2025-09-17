"use client";

const KEY_PREFIX = "bmx_ab_";

export function getVariant(key: string, variants: string[] = ["A", "B"]): string {
  const storageKey = KEY_PREFIX + key;
  if (typeof window === "undefined") return variants[0];
  let v = localStorage.getItem(storageKey);
  if (!v || !variants.includes(v)) {
    v = Math.random() < 0.5 ? variants[0] : variants[1];
    localStorage.setItem(storageKey, v);
  }
  return v;
}

export function ctaLabel(variant: string): string {
  return variant === "B" ? "Ia bonusul acum" : "RevendicÃ„Æ’ bonusul";
}
