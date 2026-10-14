import { Analytics, STATUSES } from '../types';

export default function StatCards({ data, extra }: { data: Analytics | null; extra: [string, number | undefined][] }) {
  if (!data) return null;
  const max = Math.max(1, ...STATUSES.map((s) => data.status[s] ?? 0));
  return (
    <section aria-label="Analytics" className="mb-8 grid gap-4 md:grid-cols-[1fr_2fr]">
      <div className="panel grid grid-cols-2 gap-4">
        {[['Applications', data.total] as [string, number | undefined], ...extra].map(([label, n]) => (
          <div key={label}><p className="font-display text-3xl font-bold">{n ?? 0}</p><p className="text-sm text-ink-500 dark:text-ink-200">{label}</p></div>
        ))}
      </div>
      <div className="panel space-y-2">
        <h2 className="font-display font-bold">Pipeline by stage</h2>
        {STATUSES.map((s) => (
          <div key={s} className="flex items-center gap-3 text-sm">
            <span className="w-24">{s}</span>
            <div className="h-3 flex-1 rounded bg-ink-100 dark:bg-ink-700"><div className="h-3 rounded bg-span-600" style={{ width: `${((data.status[s] ?? 0) / max) * 100}%` }} /></div>
            <span className="w-6 text-right">{data.status[s] ?? 0}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
