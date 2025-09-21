'use client';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { apiForgotPassword, apiLogin, apiRegister, apiResetPassword, apiVerifyReset } from '@services/auth';
import { useRouter } from 'next/navigation';

export type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const switchTo = (m: AuthMode) => setMode(m);

  // initialize mode from URL hash (e.g., /auth#register)
  useEffect(() => {
    const hashToMode = (): AuthMode => {
      const h = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase();
      if (h.includes('register')) return 'register';
      if (h.includes('forgot')) return 'forgot';
      if (h.includes('reset')) return 'reset';
      return 'login';
    };
    setMode(hashToMode());
    const onHash = () => setMode(hashToMode());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);
    const fd = new FormData(e.currentTarget);

    try {
      if (mode === 'login') {
        const email = String(fd.get('email'));
        const password = String(fd.get('password'));
        if (!email || !password) throw new Error('Email and password are required');
        const res = await signIn('credentials', { email, password, redirect: false });
        if (res?.error) {
          setIsError(true);
          throw new Error('One or more credentials are incorrect. Please try again.');
        }
        setMessage('Logged in successfully');
        router.push('/products');
      } else if (mode === 'register') {
        const payload = {
          name: String(fd.get('name')),
          email: String(fd.get('email')),
          password: String(fd.get('password')),
          rePassword: String(fd.get('rePassword')),
          phone: String(fd.get('phone') || ''),
        };
        if (!payload.name || !payload.email || !payload.password || !payload.rePassword) throw new Error('Please fill all required fields');
        if (payload.password !== payload.rePassword) throw new Error('Passwords do not match');
        await apiRegister(payload);
        setMessage('Registered successfully. You can now sign in.');
        setMode('login');
      } else if (mode === 'forgot') {
        const email = String(fd.get('email'));
        if (!email) throw new Error('Email is required');
        await apiForgotPassword(email);
        setMessage('Reset code sent to your email.');
        setMode('reset');
      } else if (mode === 'reset') {
        const code = String(fd.get('code'));
        const email = String(fd.get('email'));
        const newPassword = String(fd.get('newPassword'));
        if (!code || !email || !newPassword) throw new Error('Please fill all reset fields');
        await apiVerifyReset(code);
        await apiResetPassword(email, newPassword);
        setMessage('Password has been reset. You can login now.');
        setMode('login');
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Something went wrong';
      setMessage(msg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in" data-anim>
      <div className={`transition-all duration-300 ${loading ? 'opacity-70' : ''}`}>
        <form onSubmit={onSubmit} className="space-y-4 bg-white/70 backdrop-blur p-6 rounded-2xl border border-slate-200">
          {mode === 'register' && (
            <input name="name" required placeholder="Name" className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
          )}
          {(mode === 'register' || mode === 'login' || mode === 'forgot' || mode === 'reset') && (
            <input name="email" type="email" required placeholder="Email" className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
          )}
          {mode === 'register' && (
            <input name="phone" placeholder="Phone (optional)" className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
          )}
          {(mode === 'register' || mode === 'login') && (
            <div className="relative">
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Password"
                className="w-full border border-slate-200 px-3 py-2 rounded neo-focus pr-9"
              />
              <button
                type="button"
                aria-label={showPass ? 'Hide password' : 'Show password'}
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3l18 18"/><path d="M10.58 10.58a3 3 0 104.24 4.24"/><path d="M16.68 16.68A10.94 10.94 0 0112 18c-5 0-9.27-3.11-11-7.5a12.66 12.66 0 013.17-4.5"/><path d="M9.88 5.08A10.94 10.94 0 0112 4.5c5 0 9.27 3.11 11 7.5a12.82 12.82 0 01-1.67 2.6"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12S5 4.5 12 4.5 23 12 23 12s-4 7.5-11 7.5S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
                )}
              </button>
            </div>
          )}
          {mode === 'register' && (
            <div className="relative">
              <input
                name="rePassword"
                type={showRePass ? 'text' : 'password'}
                required
                placeholder="Confirm Password"
                className="w-full border border-slate-200 px-3 py-2 rounded neo-focus pr-9"
              />
              <button
                type="button"
                aria-label={showRePass ? 'Hide password' : 'Show password'}
                onClick={() => setShowRePass((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showRePass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3l18 18"/><path d="M10.58 10.58a3 3 0 104.24 4.24"/><path d="M16.68 16.68A10.94 10.94 0 0112 18c-5 0-9.27-3.11-11-7.5a12.66 12.66 0 013.17-4.5"/><path d="M9.88 5.08A10.94 10.94 0 0112 4.5c5 0 9.27 3.11 11 7.5a12.82 12.82 0 01-1.67 2.6"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12S5 4.5 12 4.5 23 12 23 12s-4 7.5-11 7.5S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
                )}
              </button>
            </div>
          )}
          {mode === 'reset' && (
            <>
              <input name="code" required placeholder="Reset Code" className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
              <div className="relative">
                <input
                  name="newPassword"
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="New Password"
                  className="w-full border border-slate-200 px-3 py-2 rounded neo-focus pr-9"
                />
                <button
                  type="button"
                  aria-label={showNewPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowNewPass((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showNewPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3l18 18"/><path d="M10.58 10.58a3 3 0 104.24 4.24"/><path d="M16.68 16.68A10.94 10.94 0 0112 18c-5 0-9.27-3.11-11-7.5a12.66 12.66 0 013.17-4.5"/><path d="M9.88 5.08A10.94 10.94 0 0112 4.5c5 0 9.27 3.11 11 7.5a12.82 12.82 0 01-1.67 2.6"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12S5 4.5 12 4.5 23 12 23 12s-4 7.5-11 7.5S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
                  )}
                </button>
              </div>
            </>
          )}

          <button disabled={loading} className="w-full py-2 rounded-full bg-slate-900 text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.25)] transition-all">
            {loading ? 'Please wait...' : 'Submit'}
          </button>

          {/* Inline links instead of tabs */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => switchTo('forgot')} className="text-slate-600 hover:underline">Forgot password?</button>
              <button type="button" onClick={() => switchTo('register')} className="text-slate-900 hover:underline">Create account</button>
            </div>
          )}
          {(mode === 'register' || mode === 'forgot' || mode === 'reset') && (
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => switchTo('login')} className="text-slate-600 hover:underline">Back to sign in</button>
            </div>
          )}

          {message && (
            <p className={`text-center text-sm ${isError ? 'text-red-600' : 'text-slate-700'}`}>{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
