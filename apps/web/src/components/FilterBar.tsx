import { getOperators } from '@bonusmax/lib';

export default async function FilterBar({
  basePath,
  currentOperator,
  currentSort,
  currentMinWr,
  currentMaxWr,
  currentMaxMinDep,
}: {
  basePath: string;
  currentOperator?: string | null;
  currentSort?: string | null;
  currentMinWr?: number | null;
  currentMaxWr?: number | null;
  currentMaxMinDep?: number | null;
}) {
  const ops = await getOperators();
  const sort = currentSort ?? 'priority';
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <form action={basePath} className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col">
          <label className="text-xs opacity-70">Operator</label>
          <select
            name="operator"
            defaultValue={currentOperator ?? ''}
            className="rounded border bg-transparent px-3 py-2 text-sm"
          >
            <option value="">Toți operatorii</option>
            {ops.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs opacity-70">Sortare</label>
          <select
            name="sort"
            defaultValue={sort}
            className="rounded border bg-transparent px-3 py-2 text-sm"
          >
            <option value="priority">Recomandate</option>
            <option value="recent">Cele mai noi</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs opacity-70">WR minim</label>
          <input
            type="number"
            name="min_wr"
            defaultValue={currentMinWr ?? ''}
            placeholder="ex: 20"
            className="w-28 rounded border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs opacity-70">WR maxim</label>
          <input
            type="number"
            name="max_wr"
            defaultValue={currentMaxWr ?? ''}
            placeholder="ex: 35"
            className="w-28 rounded border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs opacity-70">Depozit max (RON)</label>
          <input
            type="number"
            name="max_min_dep"
            defaultValue={currentMaxMinDep ?? ''}
            placeholder="ex: 50"
            className="w-32 rounded border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <button className="rounded border px-3 py-2 text-sm" type="submit">
          Aplică
        </button>
        <a href={basePath} className="rounded border px-3 py-2 text-sm">
          Reset
        </a>
        <a href={`${basePath}?view=table`} className="rounded border px-3 py-2 text-sm">
          Tabel
        </a>
      </form>
    </div>
  );
}
