import { ShieldCheck, Lock, BadgeCheck } from "lucide-react";

export default function TrustBadges() {
  const Item = ({ icon: Icon, label }: { icon: any; label: string }) => (
    <div className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
      <Icon size={16} aria-hidden />
      <span>{label}</span>
    </div>
  );
  return (
    <div className="mx-auto mt-2 max-w-5xl px-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <Item icon={ShieldCheck} label="Operatori licențiați ONJN" />
        <Item icon={Lock} label="Linkuri sigure & monitorizate" />
        <Item icon={BadgeCheck} label="Termeni clari & transparență" />
      </div>
    </div>
  );
}
