/* Monochrome inline SVG placeholders for common payment methods.
   - Use `currentColor` so theme colors apply automatically.
   - Default: text-zinc-400; On hover via parent .group: text-white + soft glow.
*/

type IconProps = { className?: string; title?: string };

const glow =
  'text-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300';

/* ===== Icons ===== */

export function VisaIcon({ className = '', title = 'VISA (placeholder)' }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 28"
      role="img"
      aria-hidden="true"
      className={`h-6 w-auto ${glow} ${className}`}
    >
      <title>{title}</title>
      <rect x="1.5" y="1.5" width="45" height="25" rx="6" fill="currentColor" opacity=".08" />
      <path
        d="M9 19l3.2-10h3.1L12 19H9zm9.8-10h2.9l2.1 10h-3l-.3-2h-3l-.7 2h-2.8l3.8-10zm1.6 6.1h1.9l-.6-3-1.3 3zM28 9h2.8l2 6.2L35 9h2.7l-3.2 10h-2.8L28 9zM39 12.5c0-2.3 1.9-3.8 4.8-3.8 1 0 2 .1 2.7.3l-.6 2.3c-.6-.2-1.3-.3-2.1-.3-1.3 0-2.1.6-2.1 1.5s.7 1.4 2.3 1.9c2 .7 3 1.7 3 3.5 0 2.3-2 3.9-5.1 3.9-1.2 0-2.4-.2-3.4-.6l.5-2.3c.9.3 2 .5 3 .5 1.4 0 2.3-.6 2.3-1.5 0-.9-.6-1.3-2.1-1.8-2.1-.7-3.2-1.7-3.2-3.6z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MastercardIcon({ className = '', title = 'Mastercard (placeholder)' }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 28"
      role="img"
      aria-hidden="true"
      className={`h-6 w-auto ${glow} ${className}`}
    >
      <title>{title}</title>
      <rect x="1.5" y="1.5" width="45" height="25" rx="6" fill="currentColor" opacity=".08" />
      {/* two overlapping circles */}
      <circle cx="20" cy="14" r="6.5" fill="currentColor" opacity=".55" />
      <circle cx="28" cy="14" r="6.5" fill="currentColor" opacity=".35" />
      <circle cx="24" cy="14" r="6.5" fill="currentColor" opacity=".7" />
    </svg>
  );
}

export function SkrillIcon({ className = '', title = 'Skrill (placeholder)' }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 28"
      role="img"
      aria-hidden="true"
      className={`h-6 w-auto ${glow} ${className}`}
    >
      <title>{title}</title>
      <rect x="1.5" y="1.5" width="45" height="25" rx="6" fill="currentColor" opacity=".08" />
      <path
        d="M10 19v-7h3v7h-3zm5 0v-7h3v7h-3zm6.5 0H19v-7h2.5v1.1h.1c.4-.7 1.2-1.3 2.2-1.3 1.7 0 2.7 1.2 2.7 3.2V19h-3v-3.4c0-.8-.4-1.3-1.1-1.3-.6 0-1.2.4-1.2 1.4V19zM32 12h3v7h-3zM37 10.8c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1-.5 1.1-1.1 1.1S37 11.4 37 10.8zm0 1.2h2.3V19H37v-7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NetellerIcon({ className = '', title = 'Neteller (placeholder)' }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 28"
      role="img"
      aria-hidden="true"
      className={`h-6 w-auto ${glow} ${className}`}
    >
      <title>{title}</title>
      <rect x="1.5" y="1.5" width="45" height="25" rx="6" fill="currentColor" opacity=".08" />
      <path
        d="M10 19v-10l7 10h3v-10h-3v6.9L11 9H8v10h2zm16-7h3v7h-3v-7zm5 0h7v2h-4v1.2h3.6v2H33V12z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PaysafeIcon({ className = '', title = 'Paysafe (placeholder)' }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 28"
      role="img"
      aria-hidden="true"
      className={`h-6 w-auto ${glow} ${className}`}
    >
      <title>{title}</title>
      <rect x="1.5" y="1.5" width="45" height="25" rx="6" fill="currentColor" opacity=".08" />
      {/* ticket + keyhole */}
      <rect
        x="10"
        y="8"
        width="28"
        height="12"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="24" cy="14" r="2.2" fill="currentColor" />
      <path d="M24 16v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function RevolutIcon({ className = '', title = 'Revolut (placeholder)' }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 28"
      role="img"
      aria-hidden="true"
      className={`h-6 w-auto ${glow} ${className}`}
    >
      <title>{title}</title>
      <rect x="1.5" y="1.5" width="45" height="25" rx="6" fill="currentColor" opacity=".08" />
      <path
        d="M15 19V9h6.3c2.7 0 4.4 1.6 4.4 3.8 0 1.5-.9 2.8-2.4 3.3l2.8 2.9H23l-2.4-2.6H18v2.6h-3zm3-5h3.2c1 0 1.8-.6 1.8-1.5s-.8-1.5-1.8-1.5H18v3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BankTransferIcon({
  className = '',
  title = 'Bank Transfer (placeholder)',
}: IconProps) {
  return (
    <svg
      viewBox="0 0 48 28"
      role="img"
      aria-hidden="true"
      className={`h-6 w-auto ${glow} ${className}`}
    >
      <title>{title}</title>
      <rect x="1.5" y="1.5" width="45" height="25" rx="6" fill="currentColor" opacity=".08" />
      {/* bank */}
      <path
        d="M24 7l13 6H11l13-6zM12 14h24v2H12zM14 18h4v3h-4zM22 18h4v3h-4zM30 18h4v3h-4z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ===== Badges & Rows ===== */

export function PaymentBadge({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1 ${className}`}
    >
      <span className="group inline-flex">{children}</span>
      <span className="text-xs text-zinc-300">{label}</span>
    </span>
  );
}

export function PaymentRow() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <PaymentBadge label="VISA">
        <VisaIcon />
      </PaymentBadge>
      <PaymentBadge label="Mastercard">
        <MastercardIcon />
      </PaymentBadge>
      <PaymentBadge label="Skrill">
        <SkrillIcon />
      </PaymentBadge>
      <PaymentBadge label="Neteller">
        <NetellerIcon />
      </PaymentBadge>
      <PaymentBadge label="Paysafe">
        <PaysafeIcon />
      </PaymentBadge>
      <PaymentBadge label="Revolut">
        <RevolutIcon />
      </PaymentBadge>
      <PaymentBadge label="Transfer bancar">
        <BankTransferIcon />
      </PaymentBadge>
    </div>
  );
}
