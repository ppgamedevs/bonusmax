'use client';
import { usePathname } from 'next/navigation';

export default function BackButton() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  function goBack() {
    if (typeof window === 'undefined') return;
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  }
  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="ÃƒÅ½napoi"
      className="inline-flex items-center justify-center rounded-lg border px-2.5 py-1.5 text-sm underline opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-2"
    >
      Ã¢â€ Â ÃƒÅ½napoi
    </button>
  );
}
