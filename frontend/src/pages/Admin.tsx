import { useEffect, useState } from 'react';
import { api } from '../api';
import StatCards from '../components/StatCards';
import { Analytics } from '../types';

interface U { _id: string; name: string; email: string; role: string; company?: string; createdAt: string }

export default function Admin() {
  const [users, setUsers] = useState<U[]>([]);
  const [stats, setStats] = useState<Analytics | null>(null);
  const [error, setError] = useState('');
  const load = () => Promise.all([api('/admin/users'), api('/analytics')]).then(([u, s]) => { setUsers(u.users); setStats(s); }).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const remove = async (u: U) => {
    if (!confirm(`Delete ${u.name} and all their listings or applications?`)) return;
    try { await api(`/admin/users/${u._id}`, { method: 'DELETE' }); load(); } catch (e) { setError((e as Error).message); }
  };
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Admin dashboard</h1>
      {error && <p role="alert" className="mb-4 rounded bg-red-100 p-3 text-red-800">{error}</p>}
      <StatCards data={stats} extra={[['Students', stats?.students], ['Recruiters', stats?.recruiters], ['Listings', stats?.jobs]]} />
      <section className="panel overflow-x-auto">
        <h2 className="mb-3 text-xl font-bold">Users</h2>
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-ink-200 dark:border-ink-700"><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u._id} className="border-b border-ink-100 dark:border-ink-700">
              <td className="py-2">{u.name}{u.company && ` (${u.company})`}</td><td>{u.email}</td><td>{u.role}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="text-right">{u.role !== 'admin' && <button className="btn-danger" onClick={() => remove(u)}>Delete</button>}</td>
            </tr>))}
          </tbody>
        </table>
      </section>
    </>
  );
}
