import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiLogin } from '@services/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await apiLogin({ email: credentials.email, password: credentials.password });
          const { user, token } = res;
          if (!user || !token) return null;
          return { id: user._id || user.id || user.email, name: user.name, email: user.email, token } as any;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).accessToken = (user as any).token;
        (token as any).user = { name: user.name, email: user.email, id: (user as any).id };
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      if ((token as any).user) (session as any).user = (token as any).user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
