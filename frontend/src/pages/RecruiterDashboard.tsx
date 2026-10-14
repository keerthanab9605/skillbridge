import { FormEvent, useEffect, useState } from 'react';
import { api, API_URL } from '../api';
import StatCards from '../components/StatCards';
import StatusBadge from '../components/StatusBadge';
import { Analytics, Applicant, Job, STATUSES, Status } from '../types';

const empty = { title: '', company: '', location: '', type: 'Job', mode: 'Onsite', salary: '', skills: '', description: '' };

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Analytics | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [error, setError] = useState('');

  const load = () => Promise.all([api('/jobs/mine/list'), api('/analytics')]).then(([j, s]) => { setJobs(j.jobs); setStats(s); }).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const post = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    try { await api('/jobs', { method: 'POST', body: form }); setForm(empty); setShowForm(false); load(); } catch (err) { setError((err as Error).message); }
  };
  const remove = async (id: string) => { if (confirm('Delete this listing and its applications?')) { await api(`/jobs/${id}`, { method: 'DELETE' }); load(); } };
  const toggle = async (id: string) => {
    if (openId === id) return setOpenId(null);
    const d = await api(`/applications/job/${id}`); setApplicants(d.applications); setOpenId(id);
  };
  const setStatus = async (appId: string, status: Status) => {
    await api(`/applications/${appId}/status`, { method: 'PATCH', body: { status } });
    setApplicants((a) => a.map((x) => (x._id === appId ? { ...x, status } : x))); load();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recruiter hub</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close form' : 'Post a job'}</button>
      </div>
      {error && <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-red-800">{error}</p>}
      <StatCards data={stats} extra={[['Open listings', stats?.jobs]]} />

      {showForm && (
        <form onSubmit={post} className="panel mb-8 grid gap-4 md:grid-cols-2">
          <div><label className="label" htmlFor="t">Title</label><input id="t" required className="input" value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
          <div><label className="label" htmlFor="co">Company (defaults to your profile)</label><input id="co" className="input" value={form.company} onChange={(e) => set('company', e.target.value)} /></div>
          <div><label className="label" htmlFor="l">Location</label><input id="l" required className="input" value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
          <div><label className="label" htmlFor="sa">Salary or stipend</label><input id="sa" className="input" value={form.salary} onChange={(e) => set('salary', e.target.value)} /></div>
          <div><label className="label" htmlFor="ty">Type</label><select id="ty" className="input" value={form.type} onChange={(e) => set('type', e.target.value)}><option>Job</option><option>Internship</option></select></div>
          <div><label className="label" htmlFor="mo">Work mode</label><select id="mo" className="input" value={form.mode} onChange={(e) => set('mode', e.target.value)}><option>Onsite</option><option>Remote</option><option>Hybrid</option></select></div>
          <div className="md:col-span-2"><label className="label" htmlFor="sk">Skills (comma separated)</label><input id="sk" className="input" value={form.skills} onChange={(e) => set('skills', e.target.value)} /></div>
          <div className="md:col-span-2"><label className="label" htmlFor="d">Description</label><textarea id="d" required rows={5} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="md:col-span-2"><button className="btn-primary">Publish listing</button></div>
        </form>
      )}

      <h2 className="mb-3 text-xl font-bold">Your listings</h2>
      {jobs.length === 0 && <p className="panel">No listings yet. Use Post a job to publish your first one.</p>}
      <div className="space-y-4">
        {jobs.map((j) => (
          <article key={j._id} className="panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="font-bold">{j.title}</h3><p className="text-sm text-ink-500 dark:text-ink-200">{j.location} · {j.type} · {j.applicants} applicant{j.applicants === 1 ? '' : 's'}</p></div>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => toggle(j._id)} aria-expanded={openId === j._id}>{openId === j._id ? 'Hide applicants' : 'View applicants'}</button>
                <button className="btn-danger" onClick={() => remove(j._id)}>Delete</button>
              </div>
            </div>
            {openId === j._id && (
              <div className="mt-4 overflow-x-auto">
                {applicants.length === 0 ? <p className="text-sm">No applications yet.</p> : (
                  <table className="w-full text-left text-sm">
                    <thead><tr className="border-b border-ink-200 dark:border-ink-700"><th className="py-2">Candidate</th><th>Skills</th><th>Resume</th><th>Status</th></tr></thead>
                    <tbody>{applicants.map((a) => (
                      <tr key={a._id} className="border-b border-ink-100 align-top dark:border-ink-700">
                        <td className="py-2"><p className="font-semibold">{a.student.name}</p><p>{a.student.email}</p>{a.coverNote && <p className="mt-1 max-w-xs italic">{a.coverNote}</p>}</td>
                        <td>{a.student.skills.join(', ')}</td>
                        <td>{a.student.resumeUrl ? <a className="underline" target="_blank" rel="noreferrer" href={`${API_URL}${a.student.resumeUrl}`}>Open PDF</a> : 'Not uploaded'}</td>
                        <td><StatusBadge status={a.status} />
                          <select aria-label={`Status for ${a.student.name}`} className="input mt-2" value={a.status} onChange={(e) => setStatus(a._id, e.target.value as Status)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
                      </tr>))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
