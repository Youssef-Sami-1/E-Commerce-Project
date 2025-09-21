'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { fetchOrder } from '@services/orders';
import Link from 'next/link';

export default function OrderDetailPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // no cancel button per request

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!token || !id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchOrder(token, id);
        const data = res?.data || res; // support either {data} or direct object
        if (alive) setOrder(data);
      } catch (e: any) {
        if (alive) setError(e?.message || 'Failed to load order');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [token, id]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Order Details</h1>
        <Link href="/orders" className="text-sm underline">Back to Orders</Link>
      </div>

      {!token && (
        <p className="text-slate-700">Please <a href="/auth" className="underline">sign in</a> to view this order.</p>
      )}

      {token && (
        <>
          {loading && <p className="text-slate-600">Loading…</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {order && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Order #{order.id || order._id}</div>
                    <div className="text-sm text-slate-600">Status: {order.status || order.paymentStatus || '—'}</div>
                  </div>
                  <div className="text-sm text-slate-600">Total: ${Number(order.totalOrderPrice || order.total || 0).toFixed(2)}</div>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-sm text-slate-500 mb-1">Shipping address</div>
                  <div className="text-slate-800">{order.shippingAddress?.details}</div>
                  <div className="text-slate-600">{order.shippingAddress?.city} • {order.shippingAddress?.phone}</div>
                </div>
              )}

              {Array.isArray(order.cartItems || order.items) && (
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="text-sm text-slate-500 mb-3">Items</div>
                  <div className="space-y-3">
                    {(order.cartItems || order.items).map((it: any, idx: number) => (
                      <div key={it._id || idx} className="flex items-center justify-between">
                        <div className="min-w-0">
                          <Link href={`/products/${it.product?._id || it.product?.id || it._id || ''}`} className="hover:underline block truncate max-w-[60vw]">
                            {it.product?.title || it.title || 'Product'}
                          </Link>
                          <div className="text-sm text-slate-600">Qty: {it.count || it.quantity || 1}</div>
                        </div>
                        <div className="text-sm">${Number(it.price || 0).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
