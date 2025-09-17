export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border p-3">
      <div className="h-4 w-24 rounded bg-neutral-200" />
      <div className="mt-3 h-6 w-3/4 rounded bg-neutral-200" />
      <div className="mt-2 h-4 w-1/2 rounded bg-neutral-200" />
      <div className="mt-4 h-8 w-full rounded bg-neutral-200" />
    </div>
  );
}

export function SkeletonCards({ n = 6 }: { n?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border p-4 text-center">
          <div className="mx-auto h-6 w-16 rounded bg-neutral-200" />
          <div className="mx-auto mt-2 h-3 w-24 rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}
