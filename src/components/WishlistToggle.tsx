"use client";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@redux/store';
import HeartIcon from '@components/icons/Heart';
import { useSession } from 'next-auth/react';
import { addToWishlist, getWishlist, removeFromWishlist } from '@services/wishlist';
import { setWishlist, toggleWishlist } from '@redux/slices/wishlistSlice';

export default function WishlistToggle({ productId, className }: { productId: string; className?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const inWishlist = useSelector((s: RootState) => s.wishlist.productIds.includes(productId));
  const [loading, setLoading] = useState(false);

  async function onToggle() {
    try {
      setLoading(true);
      if (!token) {
        dispatch(toggleWishlist(productId));
        return;
      }
      // optimistic flip
      dispatch(toggleWishlist(productId));
      if (inWishlist) {
        await removeFromWishlist(token, productId);
      } else {
        await addToWishlist(token, productId);
      }
      // sync from server
      const list = await getWishlist(token);
      const ids = Array.isArray(list?.data) ? list.data.map((p: { _id: string }) => p._id) : [];
      dispatch(setWishlist(ids));
    } catch {
      if (token) {
        try {
          const list = await getWishlist(token);
          const ids = Array.isArray(list?.data) ? list.data.map((p: { _id: string }) => p._id) : [];
          dispatch(setWishlist(ids));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      disabled={loading}
      onClick={onToggle}
      className={`inline-flex items-center gap-2 transition-transform hover:scale-110 btn-press disabled:opacity-60 ${className || ''}`}
    >
      <HeartIcon filled={inWishlist} className={`${inWishlist ? 'text-red-500' : 'text-slate-900'} w-6 h-6`} />
      {loading && (
        <svg className="animate-spin h-4 w-4 text-slate-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
    </button>
  );
}
