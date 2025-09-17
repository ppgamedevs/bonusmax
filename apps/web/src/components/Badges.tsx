export function LicensedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
      Licențiat ONJN
    </span>
  );
}

export function SponsoredBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
      Sponsored
    </span>
  );
}
