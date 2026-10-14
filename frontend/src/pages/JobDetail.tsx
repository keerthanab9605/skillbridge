import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Job } from '../types';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { api(`/jobs/${id}`).then((d) => setJob(d.job)).catch((e) => setError(e.message)); }, [id]);

  const apply = async (e: FormEvent) => {
    e.preventDefault();
    try { await api(`/applications/job/${id}`, { method: 'POST', body: { coverNote: note } }); setMsg({ ok: true, text: 'Application sent. Track it under My applications.' }); }
    catch (err) { setMsg({ ok: false, text: (err as Error).message }); }
  };

  if (error) return <p role="alert" className="panel">{error}</p>;
  if (!job) return <p>Loading…</p>;
  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <article className="panel">
        <Link to="/jobs" className="text-sm underline">Back to jobs</Link>
        <h1 className="mt-3 text-3xl font-bold">{job.title}</h1>
        <p className="text-ink-500 dark:text-ink-200">{job.company} · {job.location} · {job.mode} · {job.type}{job.salary && ` · ${job.salary}`}</p>
        <h2 className="mt-6 text-lg font-bold">About the role</h2>
        <p className="mt-1 max-w-prose whitespace-pre-line">{job.description}</p>
        <h2 className="mt-6 text-lg font-bold">Skills</h2>
        <div className="mt-2 flex flex-wrap gap-2">{job.skills.map((s) => <span key={s} className="rounded bg-ink-100 px-2 py-1 text-sm dark:bg-ink-700">{s}</span>)}</div>
      </article>
      <aside className="panel h-fit">
        <h2 className="font-display text-lg font-bold">Apply for this role</h2>
        {!user && <p className="mt-2 text-sm"><Link className="underline" to="/login">Log in</Link> or <Link className="underline" to="/register">create a student account</Link> to apply.</p>}
        {user && user.role !== 'student' && <p className="mt-2 text-sm">Only student accounts can apply.</p>}
        {user?.role === 'student' && (
          <form onSubmit={apply} className="mt-3 space-y-3">
            <label className="label" htmlFor="note">Cover note (optional)</label>
            <textarea id="note" className="input" rows={5} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tell the recruiter why you are a good fit." />
            <button className="btn-primary w-full" disabled={msg?.ok}>Submit application</button>
            {msg && <p role="status" className={msg.ok ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>{msg.text}</p>}
          </form>
        )}
      </aside>
    </div>
  );
}
