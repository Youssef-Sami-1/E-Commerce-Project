'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@redux/store';
import { addAddress, getAddresses, removeAddress, type AddressPayload } from '@services/addresses';
import { getCart, addToCartApi, clearCartApi } from '@services/cart';
import { setCart, clearCart } from '@redux/slices/cartSlice';
import { createCheckoutSession } from '@services/orders';
import { createCashOrder } from '@services/orders';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const dispatch = useDispatch();
  const cart = useSelector((s: RootState) => s.cart.items);
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // general list loading
  const [error, setError] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [proceedLoading, setProceedLoading] = useState(false);
  const [addAddrLoading, setAddAddrLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);
  const shipping = useMemo(() => (cart.length > 0 ? 8 : 0), [cart]);
  const total = subtotal + shipping;

  async function loadAddresses() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAddresses(token);
      const list = Array.isArray(res?.data) ? res.data : [];
      setAddresses(list);
      // If no selection or selected was removed, pick first by default
      if (list.length > 0 && (!selectedAddressId || !list.find(a => a._id === selectedAddressId))) {
        setSelectedAddressId(list[0]._id);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Ensure cart is in sync with backend when arriving at checkout
  useEffect(() => {
    let alive = true;
    async function syncCart() {
      if (!token) return;
      try {
        const server = await getCart(token);
        if (server?.data?._id) setCartId(server.data._id);
        const serverItems = Array.isArray(server?.data?.products)
          ? server.data.products.map((it: any) => ({
              productId: it.product?._id || it.product?.id || it._id,
              title: it.product?.title || '',
              price: Number(it.price) || 0,
              quantity: Number(it.count) || 1,
              image: it.product?.imageCover,
            }))
          : [];
        // If local cart has items missing on the server, merge them into server
        const serverIds = new Set(serverItems.map(i => i.productId));
        const local = (alive ? ( (window as any).noop, undefined ) : undefined); // keep linter quiet about window in SSR
        const localItems = ((): { productId: string; title: string; price: number; quantity: number; image?: string }[] => {
          // read latest from Redux
          // we already have 'cart' in closure; use it
          return cart;
        })();
        const toAdd = localItems.filter(i => !serverIds.has(i.productId));
        for (const it of toAdd) {
          await addToCartApi(token, it.productId);
        }
        // Re-fetch after potential merge
        const refreshed = await getCart(token);
        if (refreshed?.data?._id) setCartId(refreshed.data._id);
        const merged = Array.isArray(refreshed?.data?.products)
          ? refreshed.data.products.map((it: any) => ({
              productId: it.product?._id || it.product?.id || it._id,
              title: it.product?.title || '',
              price: Number(it.price) || 0,
              quantity: Number(it.count) || 1,
              image: it.product?.imageCover,
            }))
          : [];
        if (alive) dispatch(setCart(merged));
      } catch {
        // ignore
      }
    }
    syncCart();
    return () => { alive = false; };
  }, [token, dispatch, cart]);

  async function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const fd = new FormData(e.currentTarget);
    const payload: AddressPayload = {
      name: String(fd.get('name')),
      details: String(fd.get('details')),
      phone: String(fd.get('phone')),
      city: String(fd.get('city')),
    };
    setAddAddrLoading(true);
    setError(null);
    try {
      const res = await addAddress(token, payload);
      (e.currentTarget as HTMLFormElement).reset();
      // Optimistically prepend new address if available in response
      const created = (res as any)?.data;
      if (created && created._id) {
        setAddresses((prev) => {
          const next = [created, ...prev];
          setSelectedAddressId(created._id);
          return next;
        });
      } else {
        await loadAddresses();
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to add address');
    } finally {
      setAddAddrLoading(false);
    }
  }

  async function onRemove(id: string) {
    if (!token) return;
    setRemovingId(id);
    setError(null);
    try {
      // Optimistically remove from UI first
      setAddresses((prev) => {
        const next = prev.filter((a) => a._id !== id);
        if (selectedAddressId === id) {
          setSelectedAddressId(next[0]?._id ?? null);
        }
        return next;
      });
      await removeAddress(token, id);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to remove address');
      // If server failed, reload to reflect truth
      await loadAddresses();
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      {!token && (
        <div className="p-4 rounded-xl border border-slate-200 bg-white mb-8">
          <p className="text-slate-700">Please <a href="/auth" className="underline">sign in</a> to manage addresses and complete checkout.</p>
        </div>
      )}

      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8">
        {/* Addresses */}
        <div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Shipping addresses</h2>
              {loading && <span className="text-sm text-slate-500">Loading…</span>}
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            {token && addresses.length === 0 && !loading && (
              <p className="text-slate-600">You have no saved addresses yet.</p>
            )}
            <div className="space-y-3" role="radiogroup" aria-label="Select shipping address">
              {addresses.map((a: any) => {
                const selected = selectedAddressId === a._id;
                return (
                  <div
                    key={a._id}
                    onClick={() => setSelectedAddressId(a._id)}
                    role="radio"
                    aria-checked={selected}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedAddressId(a._id); } }}
                    className={`w-full text-left p-3 rounded-xl border flex items-start justify-between ${selected ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white'} hover:bg-slate-50`}
                  >
                    <div className="pr-3">
                      <div className="font-medium flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${selected ? 'bg-slate-900' : 'bg-slate-300'}`} />
                        {a.name}
                      </div>
                      <div className="text-sm text-slate-600">{a.city} — {a.details}</div>
                      <div className="text-sm text-slate-600">{a.phone}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onRemove(a._id); }}
                      disabled={removingId === a._id}
                      className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-sm inline-flex items-center gap-2 disabled:opacity-60"
                    >
                      {removingId === a._id && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      )}
                      <span>{removingId === a._id ? 'Removing…' : 'Remove'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add new address */}
          <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-white">
            <h3 className="text-lg font-semibold mb-3">Add new address</h3>
            <form onSubmit={onAdd} className="grid md:grid-cols-2 gap-3">
              <input name="name" required placeholder="Name" className="border border-slate-200 rounded px-3 py-2 neo-focus" />
              <input name="city" required placeholder="City" className="border border-slate-200 rounded px-3 py-2 neo-focus" />
              <input name="phone" required placeholder="Phone" className="border border-slate-200 rounded px-3 py-2 neo-focus md:col-span-2" />
              <input name="details" required placeholder="Address details (street, building, etc.)" className="border border-slate-200 rounded px-3 py-2 neo-focus md:col-span-2" />
              <div className="md:col-span-2">
                <button disabled={!token || addAddrLoading} className="px-4 py-2 rounded-full bg-slate-900 text-white disabled:opacity-60 inline-flex items-center gap-2">
                  {addAddrLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  <span>{addAddrLoading ? 'Saving…' : 'Save address'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white sticky top-[calc(var(--header-h,88px)+16px)]">
            <h2 className="text-xl font-semibold mb-3">Order summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Items</span><span>{cart.length}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="border-t border-slate-200 my-2" />
              <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            {payError && <p className="mt-3 text-sm text-red-600">{payError}</p>}
            <button
              disabled={!token || cart.length === 0 || !selectedAddressId || proceedLoading}
              onClick={async () => {
                if (!token || !cartId || !selectedAddressId) return;
                try {
                  setProceedLoading(true);
                  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
                  const res = await createCheckoutSession(token, cartId, base);
                  const url = (res as any)?.session?.url || (res as any)?.url;
                  if (url) {
                    window.location.href = url;
                    return;
                  }
                  // If no URL came back, try cash order as fallback
                  const cash = await createCashOrder(token, cartId);
                  if (cash?._id || cash?.status || cash?.data) {
                    try { await clearCartApi(token); } catch {}
                    dispatch(clearCart());
                    router.push('/orders');
                    return;
                  }
                  setPayError('Could not start checkout. Please try again.');
                } catch (e: any) {
                  // Fallback to cash order on 400/other errors
                  try {
                    const cash = await createCashOrder(token, cartId);
                    if (cash?._id || cash?.status || cash?.data) {
                      try { await clearCartApi(token); } catch {}
                      dispatch(clearCart());
                      router.push('/orders');
                      return;
                    }
                  } catch {}
                  setPayError(e?.message || 'Checkout failed. Please try again.');
                } finally {
                  setProceedLoading(false);
                }
              }}
              className="mt-4 w-full px-4 py-2 rounded-full bg-slate-900 text-white disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {proceedLoading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              <span>{proceedLoading ? 'Processing…' : 'Proceed to payment'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
