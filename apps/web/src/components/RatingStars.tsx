export default function RatingStars({ value = 0, outOf = 5 }: { value?: number; outOf?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = outOf - full - (half ? 1 : 0);
  return (
    <div aria-label={`Rating ${value} din ${outOf}`} className="flex items-center gap-0.5 text-yellow-500">
      {Array.from({ length: full }).map((_, i) => <span key={`f${i}`}>Ã¢Ëœâ€¦</span>)}
      {half && <span>Ã¢Ëœâ€ </span>}
      {Array.from({ length: empty }).map((_, i) => <span key={`e${i}`} className="opacity-40">Ã¢Ëœâ€¦</span>)}
    </div>
  );
}
