import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import JobCard from '../components/JobCard';
import { Job } from '../types';

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [mode, setMode] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      const p = new URLSearchParams({ page: String(page), limit: '9' });
      if (q) p.set('q', q);
      if (type) p.set('type', type);
      if (mode) p.set('mode', mode);
      api(`/jobs?${p}`).then((d) => { setJobs(d.jobs); setPages(d.pages); setTotal(d.total); setError(''); })
        .catch((e) => setError(e.message)).finally(() => setLoading(false));
    }, 300); // debounce typing
    return () => clearTimeout(t);
  }, [q, type, mode, page]);

  useEffect(() => {
    if (user?.role === 'student') api('/users/me/saved').then((d) => setSaved(d.jobs.map((j: Job) => j._id))).catch(() => {});
  }, [user]);

  const toggleSave = async (id: string) => {
    const d = await api<{ saved: boolean }>(`/jobs/${id}/save`, { method: 'POST' });
    setSaved((s) => (d.saved ? [...s, id] : s.filter((x) => x !== id)));
  };

  return (
    <>
      <section className="mb-8 rounded-lg bg-ink-900 p-8 text-white dark:border dark:border-ink-700">
        <h1 className="max-w-xl text-3xl font-bold md:text-4xl">Your first role is a few good applications away.</h1>
        <p className="mt-2 max-w-xl text-ink-200">Search internships and entry-level jobs, save the ones you like, and track every application in one place.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <input className="input text-ink-900 dark:text-white" placeholder="Search by title, company or skill" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search jobs" />
          <select className="input text-ink-900 dark:text-white" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} aria-label="Type">
            <option value="">Jobs and internships</option><option>Job</option><option>Internship</option>
          </select>
          <select className="input text-ink-900 dark:text-white" value={mode} onChange={(e) => { setMode(e.target.value); setPage(1); }} aria-label="Work mode">
            <option value="">Any work mode</option><option>Onsite</option><option>Remote</option><option>Hybrid</option>
          </select>
        </div>
      </section>

      {error && <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-red-800">{error}</p>}
      <p className="mb-3 text-sm text-ink-500 dark:text-ink-200">{loading ? 'Loading…' : `${total} opportunities`}</p>
      {!loading && jobs.length === 0 && <p className="panel text-center">No matches. Try a broader search or clear the filters.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((j) => <JobCard key={j._id} job={j} saved={saved.includes(j._id)} onSave={user?.role === 'student' ? () => toggleSave(j._id) : undefined} />)}
      </div>
      {pages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
          <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-sm">Page {page} of {pages}</span>
          <button className="btn-ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
        </nav>
      )}
    </>
  );
}
