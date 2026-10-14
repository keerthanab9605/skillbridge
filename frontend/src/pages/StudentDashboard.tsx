import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import StatCards from '../components/StatCards';
import StatusBadge from '../components/StatusBadge';
import JobCard from '../components/JobCard';
import { Analytics, Application, Job } from '../types';

export default function StudentDashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const [saved, setSaved] = useState<Job[]>([]);
  const [stats, setStats] = useState<Analytics | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([api('/applications/mine'), api('/users/me/saved'), api('/analytics')])
      .then(([a, s, st]) => { setApps(a.applications); setSaved(s.jobs); setStats(st); })
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const withdraw = async (id: string) => {
    if (!confirm('Withdraw this application?')) return;
    await api(`/applications/${id}`, { method: 'DELETE' }); load();
  };
  const unsave = async (id: string) => { await api(`/jobs/${id}/save`, { method: 'POST' }); load(); };

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">My applications</h1>
      {error && <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-red-800">{error}</p>}
      <StatCards data={stats} extra={[['Saved jobs', stats?.saved]]} />
      <section className="panel mb-8 overflow-x-auto">
        <h2 className="mb-3 text-xl font-bold">Application tracker</h2>
        {apps.length === 0 ? <p>You have not applied yet. <Link className="underline" to="/jobs">Find a role to apply for.</Link></p> : (
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-ink-200 dark:border-ink-700"><th className="py-2">Role</th><th>Company</th><th>Applied</th><th>Status</th><th></th></tr></thead>
            <tbody>{apps.map((a) => (
              <tr key={a._id} className="border-b border-ink-100 dark:border-ink-700">
                <td className="py-2"><Link className="font-semibold hover:underline" to={`/jobs/${a.job._id}`}>{a.job.title}</Link></td>
                <td>{a.job.company}</td><td>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td><StatusBadge status={a.status} /></td>
                <td className="text-right"><button className="btn-danger" onClick={() => withdraw(a._id)}>Withdraw</button></td>
              </tr>))}
            </tbody>
          </table>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-xl font-bold">Saved jobs</h2>
        {saved.length === 0 ? <p>Nothing saved yet. Use Save on any listing to shortlist it here.</p> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{saved.map((j) => <JobCard key={j._id} job={j} saved onSave={() => unsave(j._id)} />)}</div>
        )}
      </section>
    </>
  );
}
