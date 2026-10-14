import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { homeFor } from './ProtectedRoute';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('sb_theme', next ? 'dark' : 'light');
    setDark(next);
  };
  const link = ({ isActive }: { isActive: boolean }) => `rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-ink-700 text-white' : 'text-ink-200 hover:bg-ink-800'}`;

  return (
    <header className="bg-ink-900 text-white dark:border-b dark:border-ink-700">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/jobs" className="font-display text-xl font-bold">Skill<span className="text-signal-500">Bridge</span></Link>
        <button className="rounded-md border border-ink-700 px-3 py-1 text-sm md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-14 z-10 flex-col gap-1 bg-ink-900 px-4 pb-4 md:static md:flex md:flex-row md:items-center md:p-0`}>
          <NavLink to="/jobs" className={link} onClick={() => setOpen(false)}>Jobs</NavLink>
          {user && <NavLink to={homeFor(user.role)} className={link} onClick={() => setOpen(false)}>{user.role === 'student' ? 'My applications' : user.role === 'recruiter' ? 'Recruiter hub' : 'Admin'}</NavLink>}
          {user && user.role !== 'admin' && <NavLink to="/profile" className={link} onClick={() => setOpen(false)}>Profile</NavLink>}
          <button onClick={toggleTheme} className="rounded-md px-3 py-2 text-left text-sm text-ink-200 hover:bg-ink-800" aria-label="Toggle dark mode">{dark ? 'Light mode' : 'Dark mode'}</button>
          {user ? (
            <button className="btn bg-signal-500 text-ink-900 hover:bg-amber-400" onClick={() => { logout(); nav('/login'); }}>Log out ({user.name.split(' ')[0]})</button>
          ) : (
            <>
              <NavLink to="/login" className={link}>Log in</NavLink>
              <Link to="/register" className="btn bg-signal-500 text-ink-900 hover:bg-amber-400">Create account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
