/* Monochrome inline SVG placeholders with hover glow
   Usage: wrap in a `.group` parent to enable the glow on hover.
*/

type IconProps = { className?: string; title?: string };

const glow =
  "text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300";

export function BetanoIcon({ className = "", title = "Betano (placeholder)" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      role="img"
      className={`h-6 w-6 ${glow} ${className}`}
    >
      <title>{title}</title>
      
      <rect x="4" y="4" width="40" height="40" rx="12" fill="currentColor" opacity=".08" />
      
      <path
        d="M17 14h10.5c4.2 0 7.5 3.3 7.5 7.5S31.7 29 27.5 29H17V14zm6 5v5h4.5a2.5 2.5 0 0 0 0-5H23zm-6 10h10c4 0 7 2.7 7 6s-3 6-7 6H17V29z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NetBetIcon({ className = "", title = "NetBet (placeholder)" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      role="img"
      className={`h-6 w-6 ${glow} ${className}`}
    >
      <title>{title}</title>
      
      <rect x="4" y="4" width="40" height="40" rx="12" fill="currentColor" opacity=".08" />
      
      <path
        d="M12 32V16h4l8 9.2V16h4v16h-4l-8-9.2V32h-4z"
        fill="currentColor"
      />
      <path
        d="M28 20h7a5 5 0 1 1 0 10h-7v-3h7a2 2 0 1 0 0-4h-7v-3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SuperbetIcon({ className = "", title = "Superbet (placeholder)" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      role="img"
      className={`h-6 w-6 ${glow} ${className}`}
    >
      <title>{title}</title>
      
      <rect x="4" y="4" width="40" height="40" rx="12" fill="currentColor" opacity=".08" />
      
      <circle cx="24" cy="24" r="11" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path
        d="M29.5 19.2c-1.2-1-2.7-1.7-4.5-1.7-2.6 0-4.3 1.3-4.3 2.8 0 4 10 1.3 10 7 0 2.8-2.8 4.9-6.5 4.9-2.3 0-4.5-.7-6.2-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Small helper that renders icon + brand text */
export function OperatorBadge({
  brand,
  className = "",
}: {
  brand: "Betano" | "NetBet" | "Superbet";
  className?: string;
}) {
  const base = "inline-flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1";
  return (
    <span className={`${base} ${className}`}>
      <span className="group inline-flex">
        {brand === "Betano" && <BetanoIcon />}
        {brand === "NetBet" && <NetBetIcon />}
        {brand === "Superbet" && <SuperbetIcon />}
      </span>
      <span className="text-xs text-zinc-300">{brand}</span>
    </span>
  );
}

/*
Quick usage in a bonus card header
import { OperatorBadge } from "@/components/OperatorIcons";

export function BonusCardHeader() {
  return (
    <div className="group flex items-center justify-between">
      <OperatorBadge brand="Betano" />
      
      <button
        className="rounded-full bg-gradient-to-r from-yellow-400/80 to-rose-500/80 px-4 py-2 text-sm font-semibold text-black shadow transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
      >
        RevendicÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ bonusul
      </button>
    </div>
  );
}

Notes for Windsurf (paste in the task)
ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“Use the SVG components above as placeholders for operator logos. Keep them monochrome (text-zinc-400) and apply hover glow via parent .group.ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â
ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“These are not official marks; replace paths later with provided brand SVGs without changing the API.ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â
ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“Icons must respect currentColor. On hover, color becomes white and a soft drop-shadow simulates glow.ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â
*/
