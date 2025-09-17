export default function Badges() {
  return (
    <div className="flex justify-center gap-4">
      <Badge18Plus />
      <BadgeONJN />
      <BadgeANPC />
    </div>
  );
}

function Badge18Plus() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1">
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".12"/>
        <text x="50%" y="56%" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">18+</text>
      </svg>
      <span className="text-xs text-zinc-300">JoacÃ„Æ’ responsabil</span>
    </div>
  );
}

function BadgeONJN() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1">
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
              fill="currentColor" opacity=".12"/>
        <path d="M12 5.2l5 2.1v3.6c0 3.6-2.3 6.7-5 7.8-2.7-1.1-5-4.2-5-7.8V7.3l5-2.1z"
              stroke="currentColor" strokeWidth="1.2" fill="none"/>
      </svg>
      <span className="text-xs text-zinc-300">ONJN</span>
    </div>
  );
}

function BadgeANPC() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1">
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
        <rect x="4.5" y="7.5" width="15" height="9" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="15" cy="12" r="1.5" fill="currentColor" opacity=".5"/>
      </svg>
      <span className="text-xs text-zinc-300">ANPC</span>
    </div>
  );
}
