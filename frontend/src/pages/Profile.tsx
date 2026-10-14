import { FormEvent, useEffect, useState } from 'react';
import { api, API_URL } from '../api';
import { useAuth } from '../AuthContext';
import { Profile as P } from '../types';

export default function Profile() {
  const { user } = useAuth();
  const [p, setP] = useState<P | null>(null);
  const [skills, setSkills] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { api('/users/me').then((d) => { setP(d.user); setSkills((d.user.skills || []).join(', ')); }); }, []);
  if (!p) return <p>Loading…</p>;
  const set = (k: keyof P, v: string) => setP({ ...p, [k]: v });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    try { await api('/users/me', { method: 'PUT', body: { ...p, skills } }); setMsg('Profile saved'); } catch (err) { setMsg((err as Error).message); }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    const form = new FormData(); form.append('resume', file);
    try { const d = await api<{ resumeUrl: string }>('/users/me/resume', { method: 'POST', form }); setP({ ...p, resumeUrl: d.resumeUrl }); setMsg('Resume uploaded'); }
    catch (err) { setMsg((err as Error).message); }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      <form onSubmit={save} className="panel space-y-4">
        <div><label className="label" htmlFor="n">Full name</label><input id="n" className="input" value={p.name} onChange={(e) => set('name', e.target.value)} /></div>
        {user?.role === 'recruiter' ? (
          <div><label className="label" htmlFor="c">Company</label><input id="c" className="input" value={p.company} onChange={(e) => set('company', e.target.value)} /></div>
        ) : (
          <>
            <div><label className="label" htmlFor="h">Headline</label><input id="h" className="input" maxLength={120} value={p.headline} onChange={(e) => set('headline', e.target.value)} placeholder="Final-year CSE student, React and Node.js" /></div>
            <div><label className="label" htmlFor="e">Education</label><input id="e" className="input" value={p.education} onChange={(e) => set('education', e.target.value)} /></div>
            <div><label className="label" htmlFor="s">Skills (comma separated)</label><input id="s" className="input" value={skills} onChange={(e) => setSkills(e.target.value)} /></div>
            <div><label className="label" htmlFor="b">About you</label><textarea id="b" rows={4} maxLength={600} className="input" value={p.bio} onChange={(e) => set('bio', e.target.value)} /></div>
          </>
        )}
        <button className="btn-primary">Save profile</button>
        {msg && <p role="status" className="text-sm">{msg}</p>}
      </form>
      {user?.role === 'student' && (
        <section className="panel mt-6">
          <h2 className="mb-2 text-lg font-bold">Resume</h2>
          {p.resumeUrl ? <p className="mb-3 text-sm"><a className="underline" target="_blank" rel="noreferrer" href={`${API_URL}${p.resumeUrl}`}>View current resume (PDF)</a></p> : <p className="mb-3 text-sm">No resume uploaded yet.</p>}
          <label className="label" htmlFor="r">Upload a PDF (max 2MB)</label>
          <input id="r" type="file" accept="application/pdf" onChange={(e) => upload(e.target.files?.[0])} />
        </section>
      )}
    </div>
  );
}
