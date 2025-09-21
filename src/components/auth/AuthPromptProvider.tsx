'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type AuthPromptContextType = {
  open: (opts?: { message?: string }) => void;
};

const AuthPromptContext = createContext<AuthPromptContextType | undefined>(undefined);

export default function AuthPromptProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const ctx = useMemo<AuthPromptContextType>(() => ({
    open: (opts) => {
      setMessage(opts?.message || undefined);
      setVisible(true);
    },
  }), []);

  return (
    <AuthPromptContext.Provider value={ctx}>
      {children}
      {visible && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-black/30" onClick={() => setVisible(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-fade-in relative">
              <button
                aria-label="Close"
                onClick={() => setVisible(false)}
                className="absolute right-3 top-3 p-1 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M6 18L18 6"/></svg>
              </button>
              <h3 className="text-lg font-semibold text-slate-900">You’re almost there</h3>
              <p className="mt-2 text-slate-700">
                {message || 'Sign in or create a free account to save items and check out faster.'}
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Link href="/auth#register" onClick={() => setVisible(false)} className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50">Create account</Link>
                <Link href="/auth" onClick={() => setVisible(false)} className="px-4 py-2 rounded-full bg-slate-900 text-white hover:shadow">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthPromptContext.Provider>
  );
}

export function useAuthPrompt(): AuthPromptContextType {
  const ctx = useContext(AuthPromptContext);
  if (!ctx) throw new Error('useAuthPrompt must be used within AuthPromptProvider');
  return ctx;
}
