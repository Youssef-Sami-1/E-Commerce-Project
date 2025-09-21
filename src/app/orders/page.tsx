"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchOrders } from '@services/orders';
import Link from 'next/link';

export default function OrdersPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // no cancel on this page per request

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!token) { setOrders([]); return; }
      setLoading(true);
      setError(null);
      try {
        const res = await fetchOrders(token);
        const arr = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        if (alive) setOrders(arr);
      } catch (e: any) {
        if (alive) setError(e?.message ?? 'Failed to load orders');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [token]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Orders</h1>
      {!token && <p className="text-slate-700">Please <a href="/auth" className="underline">sign in</a> to view your orders.</p>}
      {token && (
        <>
          {loading && <p className="text-slate-600">Loading...</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {!loading && orders.length === 0 && <p className="text-slate-700">You have no orders yet.</p>}
          <div className="space-y-3">
            {orders.map((o: any) => (
              <Link
                href={`/orders/${o._id || o.id}`}
                key={o._id || o.id}
                className="block p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Order #{o.id || o._id}</span>
                    <div className="text-sm text-slate-600">Status: {o.status || o.paymentStatus || '—'}</div>
                  </div>
                  <div className="text-sm text-slate-600">Total: ${Number(o.totalOrderPrice || o.total || 0).toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
