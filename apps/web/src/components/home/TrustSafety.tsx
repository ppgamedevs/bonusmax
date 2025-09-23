import { ShieldCheck, BarChart3, Link2, Target } from 'lucide-react';

function Card({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/60 p-4 shadow-sm ring-1 ring-white/10 backdrop-blur dark:bg-neutral-900/60">
      {/* Accent glow behind icon */}
      <div
        className="pointer-events-none absolute -left-3 -top-3 h-16 w-16 rounded-full opacity-60 blur-xl"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgb(var(--accent-from)), rgb(var(--accent-to)))',
        }}
      />
      <div className="relative z-10 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/60 ring-1 ring-white/30 dark:bg-white/10 dark:ring-white/10">
          <Icon size={18} aria-hidden />
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <p className="mt-1 text-sm opacity-80">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function TrustSafety() {
  return (
    <section id="trust" className="mx-auto mt-8 max-w-6xl px-4">
      <header className="mb-3">
        <h2 className="text-xl font-bold u-underline-hover">De ce poți avea încredere în noi</h2>
        <p className="mt-1 text-sm opacity-70">
          Lucrăm doar cu operatori licențiați, monitorizăm termenii și păstrăm linkurile sigure.
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        <Card
          icon={ShieldCheck}
          title="Licențe ONJN verificate"
          desc="Listăm operatori validați și marcăm vizibil licența ONJN."
        />
        <Card
          icon={BarChart3}
          title="Termeni monitorizați zilnic"
          desc="Actualizăm frecvent WR, depuneri minime și valabilități pentru acuratețe."
        />
        <Card
          icon={Link2}
          title="Linkuri sigure și actualizate"
          desc="Toate linkurile sunt verificate periodic și monitorizate pentru redirecționări."
        />
        <Card
          icon={Target}
          title="Transparență totală"
          desc="Marcăm clar conținutul sponsorizat și afișăm condițiile pe scurt."
        />
      </div>
    </section>
  );
}
