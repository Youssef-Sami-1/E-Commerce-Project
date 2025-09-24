'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@redux/store';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getCart, addToCartApi, updateCartItem, removeCartItem } from '@services/cart';
import { setCart, updateQuantity, removeFromCart } from '@redux/slices/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.cart.items);
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  type ServerCartItem = {
    product?: { _id?: string; id?: string; title?: string; imageCover?: string };
    _id?: string;
    price?: number;
    count?: number;
  };

  useEffect(() => {
    let alive = true;
    async function sync() {
      if (!token) return;
      try {
        const server = await getCart(token);
        const serverItems = Array.isArray(server?.data?.products)
          ? (server.data.products as ServerCartItem[]).map((it) => ({
              productId: it.product?._id || it.product?.id || it._id || '',
              title: it.product?.title || '',
              price: Number(it.price ?? 0),
              quantity: Number(it.count ?? 1),
              image: it.product?.imageCover,
            }))
          : [];
        const serverIds = new Set(serverItems.map((i: { productId: string }) => i.productId));
        // Merge any local items missing on server
        for (const it of items) {
          if (!serverIds.has(it.productId)) {
            await addToCartApi(token, it.productId);
          }
        }
        const refreshed = await getCart(token);
        const merged = Array.isArray(refreshed?.data?.products)
          ? (refreshed.data.products as ServerCartItem[]).map((it) => ({
              productId: it.product?._id || it.product?.id || it._id || '',
              title: it.product?.title || '',
              price: Number(it.price ?? 0),
              quantity: Number(it.count ?? 1),
              image: it.product?.imageCover,
            }))
          : [];
        if (alive) dispatch(setCart(merged));
      } catch {
        // ignore
      }
    }
    sync();
    return () => { alive = false; };
  }, [token, dispatch]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Cart</h1>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center justify-between border p-3 rounded">
            <div className="min-w-0">
              <Link href={`/products/${i.productId}`} className="font-medium hover:underline block truncate max-w-[60vw]">{i.title}</Link>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                <button
                  className="px-2 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  disabled={updatingId === i.productId}
                  onClick={async () => {
                    const next = i.quantity - 1;
                    if (token) {
                      try {
                        setUpdatingId(i.productId);
                        if (next <= 0) {
                          await removeCartItem(token, i.productId);
                        } else {
                          await updateCartItem(token, i.productId, next);
                        }
                      } finally {
                        setUpdatingId(null);
                      }
                      // Refresh from server
                      try {
                        const server = await getCart(token);
                        const mapped = Array.isArray(server?.data?.products)
                          ? (server.data.products as ServerCartItem[]).map((it) => ({
                              productId: it.product?._id || it.product?.id || it._id || '',
                              title: it.product?.title || '',
                              price: Number(it.price ?? 0),
                              quantity: Number(it.count ?? 1),
                              image: it.product?.imageCover,
                            }))
                          : [];
                        dispatch(setCart(mapped));
                      } catch {}
                    } else {
                      if (next <= 0) {
                        dispatch(removeFromCart(i.productId));
                      } else {
                        dispatch(updateQuantity({ productId: i.productId, quantity: next }));
                      }
                    }
                  }}
                >−</button>
                <span className="min-w-[2ch] text-center">{i.quantity}</span>
                <button
                  className="px-2 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                  disabled={updatingId === i.productId}
                  onClick={async () => {
                    const next = i.quantity + 1;
                    if (token) {
                      try { setUpdatingId(i.productId); await updateCartItem(token, i.productId, next); } finally { setUpdatingId(null); }
                      try {
                        const server = await getCart(token);
                        const mapped = Array.isArray(server?.data?.products)
                          ? (server.data.products as ServerCartItem[]).map((it) => ({
                              productId: it.product?._id || it.product?.id || it._id || '',
                              title: it.product?.title || '',
                              price: Number(it.price ?? 0),
                              quantity: Number(it.count ?? 1),
                              image: it.product?.imageCover,
                            }))
                          : [];
                        dispatch(setCart(mapped));
                      } catch {}
                    } else {
                      dispatch(updateQuantity({ productId: i.productId, quantity: next }));
                    }
                  }}
                >+</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="w-24 text-right">${(i.price * i.quantity).toFixed(2)}</p>
              <button
                className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm disabled:opacity-50"
                disabled={removingId === i.productId}
                onClick={async () => {
                  if (token) {
                    try { setRemovingId(i.productId); await removeCartItem(token, i.productId); } finally { setRemovingId(null); }
                    try {
                      const server = await getCart(token);
                      const mapped = Array.isArray(server?.data?.products)
                        ? (server.data.products as ServerCartItem[]).map((it) => ({
                            productId: it.product?._id || it.product?.id || it._id || '',
                            title: it.product?.title || '',
                            price: Number(it.price ?? 0),
                            quantity: Number(it.count ?? 1),
                            image: it.product?.imageCover,
                          }))
                        : [];
                      dispatch(setCart(mapped));
                    } catch {}
                  } else {
                    dispatch(removeFromCart(i.productId));
                  }
                }}
              >Remove</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-700">Your cart is empty.</p>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        <Link href="/checkout" className={`px-4 py-2 rounded-full text-white ${items.length === 0 ? 'bg-slate-400 pointer-events-none' : 'bg-slate-900'}`}>Checkout</Link>
      </div>
    </section>
  );
}
