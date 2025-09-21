'use client';
import { Provider as ReduxProvider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from '@redux/store';
import AuthPromptProvider from '@components/auth/AuthPromptProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <AuthPromptProvider>
          {children}
        </AuthPromptProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
