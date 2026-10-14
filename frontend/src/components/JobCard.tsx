import { Link } from 'react-router-dom';
import { Job } from '../types';

export default function JobCard({ job, saved, onSave }: { job: Job; saved?: boolean; onSave?: () => void }) {
  return (
    <article className="panel flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold leading-tight"><Link to={`/jobs/${job._id}`} className="hover:underline">{job.title}</Link></h3>
          <p className="text-sm text-ink-500 dark:text-ink-200">{job.company} · {job.location}</p>
        </div>
        <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${job.type === 'Internship' ? 'bg-signal-100 text-amber-800' : 'bg-span-600/10 text-span-700 dark:text-span-400'}`}>{job.type}</span>
      </div>
      <p className="text-sm">{job.mode}{job.salary && ` · ${job.salary}`}</p>
      <div className="flex flex-wrap gap-1">
        {job.skills.slice(0, 4).map((s) => <span key={s} className="rounded bg-ink-100 px-2 py-0.5 text-xs dark:bg-ink-700">{s}</span>)}
      </div>
      <div className="mt-auto flex gap-2">
        <Link to={`/jobs/${job._id}`} className="btn-primary">View details</Link>
        {onSave && <button className="btn-ghost" onClick={onSave}>{saved ? 'Saved' : 'Save'}</button>}
      </div>
    </article>
  );
}
