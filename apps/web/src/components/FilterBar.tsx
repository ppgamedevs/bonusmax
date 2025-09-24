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
          <label className="text-xs text-neutral-700 dark:text-zinc-300">Operator</label>
          <select
            name="operator"
            defaultValue={currentOperator ?? ''}
            className="rounded border px-3 py-2 text-sm border-neutral-300 bg-white text-neutral-900 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
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
          <label className="text-xs text-neutral-700 dark:text-zinc-300">Sortare</label>
          <select
            name="sort"
            defaultValue={sort}
            className="rounded border px-3 py-2 text-sm border-neutral-300 bg-white text-neutral-900 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
          >
            <option value="priority">Recomandate</option>
            <option value="recent">Cele mai noi</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-neutral-700 dark:text-zinc-300">WR minim</label>
          <input
            type="number"
            name="min_wr"
            defaultValue={currentMinWr ?? ''}
            placeholder="ex: 20"
            className="w-28 rounded border px-3 py-2 text-sm border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:placeholder:text-zinc-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-neutral-700 dark:text-zinc-300">WR maxim</label>
          <input
            type="number"
            name="max_wr"
            defaultValue={currentMaxWr ?? ''}
            placeholder="ex: 35"
            className="w-28 rounded border px-3 py-2 text-sm border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:placeholder:text-zinc-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-neutral-700 dark:text-zinc-300">Depozit max (RON)</label>
          <input
            type="number"
            name="max_min_dep"
            defaultValue={currentMaxMinDep ?? ''}
            placeholder="ex: 50"
            className="w-32 rounded border px-3 py-2 text-sm border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:placeholder:text-zinc-400"
          />
        </div>
        <button className="rounded border px-3 py-2 text-sm border-neutral-300 text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10" type="submit">
          Aplică
        </button>
        <a href={basePath} className="rounded border px-3 py-2 text-sm border-neutral-300 text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10">
          Reset
        </a>
        <a href={`${basePath}?view=table`} className="rounded border px-3 py-2 text-sm border-neutral-300 text-neutral-800 hover:bg-neutral-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/10">
          Tabel
        </a>
      </form>
    </div>
  );
}
