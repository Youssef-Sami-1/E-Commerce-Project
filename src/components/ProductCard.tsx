"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setWishlist, toggleWishlist } from '@redux/slices/wishlistSlice';
import type { AppDispatch, RootState } from '@redux/store';
import HeartIcon from '@components/icons/Heart';
import { useSession } from 'next-auth/react';
import { addToWishlist, getWishlist, removeFromWishlist } from '@services/wishlist';
import AddToCartButton from '@components/AddToCartButton';
import { useState } from 'react';
import { useAuthPrompt } from '@components/auth/AuthPromptProvider';

export default function ProductCard({ product }: { product: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const inWishlist = useSelector((s: RootState) => s.wishlist.productIds.includes(product._id));
  const token = (session as any)?.accessToken as string | undefined;
  const [wishLoading, setWishLoading] = useState(false);
  const authPrompt = useAuthPrompt();

  async function onToggleWishlist() {
    try {
      setWishLoading(true);
      if (!token) {
        authPrompt.open({ message: 'Sign in to save favorites and keep them across devices.' });
        return;
      }
      // Optimistic toggle for logged-in
      dispatch(toggleWishlist(product._id));
      if (inWishlist) {
        await removeFromWishlist(token, product._id);
      } else {
        await addToWishlist(token, product._id);
      }
      // Sync full list from server
      const list = await getWishlist(token);
      const ids = Array.isArray(list?.data) ? list.data.map((p: any) => p._id) : [];
      dispatch(setWishlist(ids));
    } catch (e) {
      // no-op: optionally show toast
      if (token) {
        // revert to server truth
        try {
          const list = await getWishlist(token);
          const ids = Array.isArray(list?.data) ? list.data.map((p: any) => p._id) : [];
          dispatch(setWishlist(ids));
        } catch {}
      }
    } finally {
      setWishLoading(false);
    }
  }

  return (
    <div className="group p-5 rounded-2xl border border-slate-200 bg-white flex flex-col card-hover soft-shadow glow-ring" data-testid="product-card">
      <Link href={`/products/${product._id}`} className="block">
        <div className="aspect-square rounded-xl bg-white overflow-hidden tilt-on-hover">
          <Image
            src={product.imageCover}
            alt={product.title}
            width={600}
            height={600}
            className="w-full h-full object-cover zoom-on-hover rounded-xl"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </Link>
      <div className="mt-3 flex-1">
        <h3 className="font-medium line-clamp-2 min-h-[3rem]">{product.title}</h3>
        <p className="mt-1 text-slate-600">${product.price}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <AddToCartButton product={product} />
        <button
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={onToggleWishlist}
          disabled={wishLoading}
          className="transition-transform hover:scale-110 btn-press inline-flex items-center gap-2 disabled:opacity-60"
        >
          <HeartIcon filled={inWishlist} className={`${inWishlist ? 'text-red-500' : 'text-slate-900'} w-6 h-6`} />
          {wishLoading && (
            <svg className="animate-spin h-4 w-4 text-slate-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
