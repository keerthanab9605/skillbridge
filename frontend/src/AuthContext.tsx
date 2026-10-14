import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from './api';
import { AuthUser, Role } from './types';

interface Ctx {
  user: AuthUser | null; loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (d: { name: string; email: string; password: string; role: Role; company?: string }) => Promise<AuthUser>;
  logout: () => void;
}
const AuthCtx = createContext<Ctx>(null as unknown as Ctx);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('sb_token')) { setLoading(false); return; }
    api<{ user: AuthUser }>('/auth/me').then((d) => setUser(d.user)).catch(() => localStorage.removeItem('sb_token')).finally(() => setLoading(false));
  }, []);

  const store = (d: { token: string; user: AuthUser }) => { localStorage.setItem('sb_token', d.token); setUser(d.user); return d.user; };
  const login: Ctx['login'] = async (email, password) => store(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register: Ctx['register'] = async (b) => store(await api('/auth/register', { method: 'POST', body: b }));
  const logout = () => { localStorage.removeItem('sb_token'); setUser(null); };

  return <AuthCtx.Provider value={{ user, loading, login, register, logout }}>{children}</AuthCtx.Provider>;
}
