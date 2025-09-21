'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // Fake send for now
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
      setMessage('This is a demo button — your message was not actually sent.');
      (e.currentTarget as HTMLFormElement).reset();
    } catch (e) {
      setMessage('This is a demo button — your message was not actually sent.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Contact us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-slate-700 mb-4">We’d love to hear from you. Send us a message and we’ll respond as soon as possible.</p>
          <ul className="text-sm text-slate-600 space-y-2">
            <li><span className="font-medium text-slate-900">Address:</span> Cairo, Egypt</li>
            <li><span className="font-medium text-slate-900">Phone:</span> +20 123 456 789</li>
          </ul>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 bg-white/70 backdrop-blur p-5 rounded-2xl border border-slate-200">
          <input name="name" required placeholder="Your name" className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
          <input name="email" type="email" required placeholder="Your email" className="w-full border border-slate-200 px-3 py-2 rounded neo-focus" />
          <textarea name="message" rows={5} required placeholder="How can we help?" className="w-full border border-slate-200 px-3 py-2 rounded neo-focus"></textarea>
          <button disabled={loading} className="px-4 py-2 rounded-full bg-slate-900 text-white disabled:opacity-60 inline-flex items-center gap-2">
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            <span>{loading ? 'Sending…' : 'Send message'}</span>
          </button>
          {message && <p className="text-sm text-slate-700">{message}</p>}
        </form>
      </div>
    </section>
  );
}
