export default function ProsCons({ pros = [], cons = [] }: { pros?: string[]; cons?: string[] }) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div>
        <h3 className="font-semibold">Pro</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">{pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
      </div>
      <div>
        <h3 className="font-semibold">Contra</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">{cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>
    </div>
  );
}
