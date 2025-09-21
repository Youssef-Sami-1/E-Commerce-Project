'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@redux/store';
import { useSession } from 'next-auth/react';
import { getWishlist, removeFromWishlist } from '@services/wishlist';
import ProductCard from '@components/ProductCard';
import { setWishlist } from '@redux/slices/wishlistSlice';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlist = useSelector((s: RootState) => s.wishlist.productIds);
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!token) { setItems([]); return; }
      setLoading(true);
      try {
        const res = await getWishlist(token);
        const arr = Array.isArray(res?.data) ? res.data : [];
        if (alive) setItems(arr);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [token]);

  async function onClear() {
    if (!token || items.length === 0) return;
    setClearing(true);
    // optimistic clear
    dispatch(setWishlist([]));
    const prev = items;
    setItems([]);
    try {
      for (const p of prev) {
        await removeFromWishlist(token, p._id);
      }
      const res = await getWishlist(token);
      const arr = Array.isArray(res?.data) ? res.data : [];
      setItems(arr);
      dispatch(setWishlist(arr.map((p: any) => p._id)));
    } catch {
      // if error, reload
      const res = await getWishlist(token);
      const arr = Array.isArray(res?.data) ? res.data : [];
      setItems(arr);
      dispatch(setWishlist(arr.map((p: any) => p._id)));
    } finally {
      setClearing(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 animate-fade-in" data-anim>
      <h1 className="text-3xl font-semibold mb-6">Wishlist</h1>
      {!token && (
        <p className="text-slate-700">Please <a className="underline" href="/auth">sign in</a> to view your wishlist.</p>
      )}
      {token && (
        <>
          <div className="mb-3 flex items-center justify-between">
            {loading ? <span className="text-slate-600 text-sm">Loading…</span> : <span className="text-slate-600 text-sm">Items: {items.length}</span>}
            <button
              onClick={onClear}
              disabled={clearing || loading || items.length === 0}
              className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-sm disabled:opacity-60 inline-flex items-center gap-2"
            >
              {clearing && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              <span>{clearing ? 'Clearing…' : 'Clear wishlist'}</span>
            </button>
          </div>
          {loading && <p className="text-slate-600">Loading...</p>}
          {!loading && items.length === 0 && <p className="text-slate-700">Your wishlist is empty.</p>}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
