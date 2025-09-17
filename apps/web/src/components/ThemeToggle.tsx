"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  function toggle(){
    const el = document.documentElement;
    const isDark = el.classList.toggle("dark");
    setDark(isDark);
    try{ localStorage.setItem("theme", isDark ? "dark" : "light"); }catch(e){}
  }
  return (
    <button onClick={toggle} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/60 px-3 py-1.5 text-sm font-semibold hover:bg-white/80 focus-accent dark:bg-neutral-900/60 dark:hover:bg-neutral-900/80">
      <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-white/70 text-black dark:bg-neutral-800 dark:text-white">
        {dark ? "☀" : "🌙"}
      </span>
      {dark ? "LIGHT" : "DARK"}
    </button>
  );
}
