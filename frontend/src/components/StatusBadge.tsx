import { Status } from '../types';
const colors: Record<Status, string> = {
  Applied: 'bg-ink-100 text-ink-700 dark:bg-ink-700 dark:text-ink-100',
  Shortlisted: 'bg-span-600/10 text-span-700 dark:text-span-400',
  Interview: 'bg-signal-100 text-amber-800',
  Offered: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};
export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold ${colors[status]}`}>{status}</span>;
}
