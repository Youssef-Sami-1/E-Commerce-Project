import AuthForm from '@components/AuthForm';

export const metadata = {
  title: 'Authenticate — NeoShop',
};

export default function AuthPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Welcome back</h1>
      <AuthForm />
    </section>
  );
}
