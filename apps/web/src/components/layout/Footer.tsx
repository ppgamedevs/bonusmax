import { PaymentRow } from "../PaymentIcons";

export default function Footer() {
  const link =
    "text-zinc-400 hover:text-white transition-colors duration-200";

  const glow =
    "group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] transition-all duration-300";

  return (
    <footer className="relative w-full border-t border-zinc-800 bg-[#0a0b0f] text-zinc-200">
      {/* subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            {/* Monochrome brand mark placeholder */}
            <svg width="28" height="28" viewBox="0 0 24 24" className="text-white">
              <defs>
                <linearGradient id="bm" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="1"/>
                  <stop offset="1" stopColor="#c8c8c8" stopOpacity="1"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#bm)" opacity=".12"/>
              <path d="M6 9h6.5a3.5 3.5 0 0 1 0 7H6V9zm3 3v3h3.5a1.5 1.5 0 0 0 0-3H9z"
                    fill="currentColor"/>
            </svg>
            <span className="text-lg font-semibold">Bonusmax</span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            Comparații de bonusuri, verificate și actualizate.
          </p>

          {/* Social (inline SVG, monochrome + glow on hover) */}
          <div className="mt-5 flex items-center gap-4">
            <a aria-label="X" href="/" className="group" rel="noopener">
              <XIcon className={glow}/>
            </a>
            <a aria-label="Facebook" href="/" className="group" rel="noopener">
              <FacebookIcon className={glow}/>
            </a>
            <a aria-label="LinkedIn" href="/" className="group" rel="noopener">
              <LinkedInIcon className={glow}/>
            </a>
            <a aria-label="Instagram" href="/" className="group" rel="noopener">
              <InstagramIcon className={glow}/>
            </a>
            <a aria-label="YouTube" href="/" className="group" rel="noopener">
              <YouTubeIcon className={glow}/>
            </a>
          </div>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Legal & Compliance
          </h4>
          <ul className="space-y-2">
            <li><a className={link} href="https://onjn.gov.ro/" target="_blank" rel="noopener">ONJN – Oficiul Național pentru Jocuri de Noroc</a></li>
            <li><a className={link} href="https://anpc.ro/" target="_blank" rel="noopener">ANPC – Protecția Consumatorilor</a></li>
            <li><a className={link} href="/politica-confidentialitate">GDPR / Politica de confidențialitate</a></li>
            <li><a className={link} href="/termeni-si-conditii">Termeni și condiții</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Support
          </h4>
          <ul className="space-y-2">
            <li><a className={link} href="/help">Help Center</a></li>
            <li><a className={link} href="/contact">Contact</a></li>
            <li><a className={link} href="/ghiduri">Ghiduri &amp; FAQ</a></li>
            <li><a className={link} href="/blog">Blog</a></li>
          </ul>
        </div>

        {/* Responsible Gaming */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Responsible Gaming
          </h4>

          <div className="flex flex-wrap items-center gap-3 max-w-full">
            <Badge18Plus/>
            <BadgeShield label="ONJN"/>
            <BadgeShield label="ANPC"/>
          </div>

          <p className="mt-3 text-xs text-zinc-400 leading-5">
            Conținut comercial. Ofertele sunt doar pentru operatori licențiați ONJN.
            Joacă responsabil. Jocurile de noroc implică riscuri financiare.
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-zinc-500">
          © 2025 Bonusmax. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
}

/* =========================
   Inline SVG placeholders
   ========================= */

function XIcon({ className = "" }) {
  return (
    <svg
      className={`h-5 w-5 text-zinc-400 group-hover:text-white ${className}`}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

function FacebookIcon({ className = "" }) {
  return (
    <svg className={`h-5 w-5 text-zinc-400 group-hover:text-white ${className}`}
         viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 9H16V6h-2.5A3.5 3.5 0 0 0 10 9.5V12H8v3h2v6h3v-6h2.1l.4-3H13v-2a1 1 0 0 1 1-1z"/>
    </svg>
  );
}

function LinkedInIcon({ className = "" }) {
  return (
    <svg className={`h-5 w-5 text-zinc-400 group-hover:text-white ${className}`}
         viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.94 7.5A1.94 1.94 0 1 1 5 5.56 1.94 1.94 0 0 1 6.94 7.5zM5.5 9h2.9v10.5H5.5zM10 9h2.8v1.6h.04A3.06 3.06 0 0 1 16.6 9c3.02 0 3.6 1.99 3.6 4.58V19.5h-2.9v-4.4c0-1.05-.02-2.41-1.47-2.41-1.47 0-1.7 1.15-1.7 2.34v4.47H10z"/>
    </svg>
  );
}

function InstagramIcon({ className = "" }) {
  return (
    <svg className={`h-5 w-5 text-zinc-400 group-hover:text-white ${className}`}
         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/>
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }) {
  return (
    <svg className={`h-5 w-5 text-zinc-400 group-hover:text-white ${className}`}
         viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12s0-3.2-.4-4.7c-.22-.82-.86-1.46-1.68-1.68C19.37 5.3 12 5.3 12 5.3s-7.37 0-8.92.32C2.26 5.84 1.62 6.48 1.4 7.3 1 8.8 1 12 1 12s0 3.2.4 4.7c.22.82.86 1.46 1.68 1.68 1.55.32 8.92.32 8.92.32s7.37 0 8.92-.32c.82-.22 1.46-.86 1.68-1.68.4-1.5.4-4.7.4-4.7z"/>
      <path d="M10 9.75v4.5l4-2.25-4-2.25z" fill="#0a0b0f"/>
    </svg>
  );
}

/** 18+ badge (monochrome) */
function Badge18Plus() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1">
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".12"/>
        <text x="50%" y="56%" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">18+</text>
      </svg>
      <span className="text-xs text-zinc-300">Joacă responsabil</span>
    </div>
  );
}

/** Shield badge placeholder (ONJN / ANPC) */
function BadgeShield({ label = "ONJN" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1">
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
              fill="currentColor" opacity=".12"/>
        <path d="M12 5.2l5 2.1v3.6c0 3.6-2.3 6.7-5 7.8-2.7-1.1-5-4.2-5-7.8V7.3l5-2.1z"
              stroke="currentColor" strokeWidth="1.2" fill="none"/>
      </svg>
      <span className="text-xs text-zinc-300">{label}</span>
    </div>
  );
}
