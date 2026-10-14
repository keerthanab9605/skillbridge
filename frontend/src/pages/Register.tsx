import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { homeFor } from '../components/ProtectedRoute';
import { Role } from '../types';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'student' as Role, company: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try { const u = await register(f); nav(homeFor(u.role), { replace: true }); }
    catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="panel mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <fieldset className="flex gap-4">
        <legend className="label">I am a</legend>
        {(['student', 'recruiter'] as Role[]).map((r) => (
          <label key={r} className="flex items-center gap-2 text-sm"><input type="radio" name="role" checked={f.role === r} onChange={() => set('role', r)} />{r === 'student' ? 'Student or fresher' : 'Recruiter'}</label>
        ))}
      </fieldset>
      <div><label className="label" htmlFor="name">Full name</label><input id="name" required className="input" value={f.name} onChange={(e) => set('name', e.target.value)} /></div>
      {f.role === 'recruiter' && <div><label className="label" htmlFor="company">Company</label><input id="company" required className="input" value={f.company} onChange={(e) => set('company', e.target.value)} /></div>}
      <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required className="input" value={f.email} onChange={(e) => set('email', e.target.value)} /></div>
      <div><label className="label" htmlFor="pw">Password (6+ characters)</label><input id="pw" type="password" minLength={6} required className="input" value={f.password} onChange={(e) => set('password', e.target.value)} /></div>
      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      <p className="text-sm">Already registered? <Link className="underline" to="/login">Log in</Link></p>
    </form>
  );
}
