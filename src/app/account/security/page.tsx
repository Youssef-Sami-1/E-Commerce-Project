'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiChangeMyPassword } from '@services/auth';

export default function AccountSecurityPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    try {
      const currentPassword = String(fd.get('currentPassword'));
      const newPassword = String(fd.get('newPassword'));
      const confirm = String(fd.get('confirm'));
      if (!currentPassword || !newPassword || !confirm) throw new Error('Please fill all fields');
      if (newPassword !== confirm) throw new Error('Passwords do not match');
      const token = (session as any)?.accessToken as string | undefined;
      if (!token) throw new Error('You must be logged in');
      await apiChangeMyPassword(token, currentPassword, newPassword);
      setMessage('Password updated successfully.');
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      setMessage(err?.message ?? 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Account Security</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white/70 backdrop-blur p-6 rounded-2xl border border-slate-200">
        <div>
          <label className="block text-sm mb-1">Current password</label>
          <input name="currentPassword" type="password" required className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">New password</label>
            <input name="newPassword" type="password" required className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm new password</label>
            <input name="confirm" type="password" required className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
          </div>
        </div>
        <button disabled={loading} className="px-5 py-2.5 rounded-full bg-slate-900 text-white disabled:opacity-70">{loading ? 'Updating...' : 'Update password'}</button>
        {message && <p className="text-sm text-slate-700">{message}</p>}
      </form>
    </section>
  );
}
