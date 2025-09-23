'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = (mounted ? (theme === 'dark' || resolvedTheme === 'dark') : false);
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={isDark ? 'Comută pe tema luminoasă' : 'Comută pe tema întunecată'}
      title={isDark ? 'Tema: Întunecată (click pentru Luminoasă)' : 'Tema: Luminoasă (click pentru Întunecată)'}
      className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-3 pr-6 py-1 text-sm text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 min-w-[140px] xl:min-w-[170px]"
    >
      <span className="relative h-5 w-10 rounded-full bg-neutral-200/80 p-0.5 transition-colors dark:bg-neutral-800">
        <span
          className={
            'absolute top-0.5 h-4 w-4 transform rounded-full bg-white text-neutral-800 shadow transition-transform duration-300 dark:bg-neutral-200 dark:text-neutral-900 ' +
            (isDark ? 'translate-x-5' : 'translate-x-0')
          }
          aria-hidden
        >
          {isDark ? (
            <Sun className="m-0.5 h-3 w-3" />
          ) : (
            <Moon className="m-0.5 h-3 w-3" />
          )}
        </span>
      </span>
      <span className="hidden lg:inline ml-auto whitespace-nowrap text-[11px]">{isDark ? 'Întunecată' : 'Luminoasă'}</span>
    </button>
  );
}
