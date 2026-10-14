export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

interface Opts { method?: string; body?: unknown; form?: FormData }

export async function api<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const token = localStorage.getItem('sb_token');
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined;
  if (opts.form) body = opts.form;
  else if (opts.body !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(opts.body); }
  const res = await fetch(`${API_URL}/api${path}`, { method: opts.method ?? 'GET', headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data as T;
}
