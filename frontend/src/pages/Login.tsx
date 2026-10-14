import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { homeFor } from '../components/ProtectedRoute';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try { const u = await login(email, password); nav(from ?? homeFor(u.role), { replace: true }); }
    catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="panel mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Log in</h1>
      <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      <p className="text-sm">New here? <Link className="underline" to="/register">Create an account</Link></p>
    </form>
  );
}
