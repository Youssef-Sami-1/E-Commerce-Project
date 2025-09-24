"use client";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@redux/store';
import { addToCart, setCart, updateQuantity, removeFromCart } from '@redux/slices/cartSlice';
import { useSession } from 'next-auth/react';
import { addToCartApi, getCart, updateCartItem, removeCartItem } from '@services/cart';
import { useState } from 'react';
import { useAuthPrompt } from '@components/auth/AuthPromptProvider';

export default function AddToCartButton({ product }: { product: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;
  const inCartItem = useSelector((s: RootState) => s.cart.items.find(i => i.productId === product._id));
  const qty = inCartItem?.quantity || 0;
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const authPrompt = useAuthPrompt();

  type ServerCartItem = {
    product?: {
      _id?: string;
      id?: string;
      title?: string;
      imageCover?: string;
    };
    _id?: string;
    price?: number;
    count?: number;
  };

  async function onAdd() {
    try {
      setAdding(true);
      if (token) {
        await addToCartApi(token, product._id);
        const server = await getCart(token);
        const items = Array.isArray(server?.data?.products)
          ? (server.data.products as ServerCartItem[]).map((it) => ({
              productId: it.product?._id || it.product?.id || it._id || '',
              title: it.product?.title || product.title,
              price: Number(it.price ?? product.price ?? 0),
              quantity: Number(it.count ?? 1),
              image: it.product?.imageCover || product.imageCover,
            }))
          : [];
        dispatch(setCart(items));
      } else {
        authPrompt.open({ message: 'Sign in to add items to your cart and checkout faster.' });
      }
    } catch (_) {
      // optionally show toast
    } finally {
      setAdding(false);
    }
  }

  async function onChangeQty(next: number) {
    try {
      setUpdating(true);
      if (token) {
        if (next <= 0) {
          await removeCartItem(token, product._id);
        } else {
          await updateCartItem(token, product._id, next);
        }
        const server = await getCart(token);
        const items = Array.isArray(server?.data?.products)
          ? (server.data.products as ServerCartItem[]).map((it) => ({
              productId: it.product?._id || it.product?.id || it._id || '',
              title: it.product?.title || product.title,
              price: Number(it.price ?? product.price ?? 0),
              quantity: Number(it.count ?? 1),
              image: it.product?.imageCover || product.imageCover,
            }))
          : [];
        dispatch(setCart(items));
      } else {
        if (next <= 0) {
          dispatch(removeFromCart(product._id));
        } else {
          dispatch(updateQuantity({ productId: product._id, quantity: next }));
        }
      }
    } finally {
      setUpdating(false);
    }
  }

  if (qty > 0) {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          onClick={() => onChangeQty(qty - 1)}
          disabled={updating}
          className="px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-60"
        >
          −
        </button>
        <span className="min-w-[2ch] text-center">{qty}</span>
        <button
          onClick={() => onChangeQty(qty + 1)}
          disabled={updating}
          className="px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-60"
        >
          +
        </button>
        {updating && (
          <svg className="animate-spin h-5 w-5 text-slate-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onAdd}
      disabled={adding}
      className="w-full md:w-auto px-5 py-2.5 rounded-full bg-slate-900 text-white hover:shadow-[0_0_30px_rgba(0,0,0,0.25)] transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
    >
      {adding && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      <span>{adding ? 'Adding…' : 'Add to Cart'}</span>
    </button>
  );
}
