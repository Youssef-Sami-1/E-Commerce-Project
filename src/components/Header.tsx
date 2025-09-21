"use client";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '@redux/store';
import HeartIcon from '@components/icons/Heart';
import CartIcon from '@components/icons/Cart';
import SearchIcon from '@components/icons/Search';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const wishlistCount = useSelector((s: RootState) => s.wishlist.productIds.length);
  const cartCount = useSelector((s: RootState) => s.cart.items.length);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [profileOpen, setProfileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateHeaderVars = () => {
      const el = headerRef.current;
      const h = el ? el.offsetHeight : 88;
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      if (open) setOpen(false);
      if (profileOpen) setProfileOpen(false);
      // don't change --header-h during scroll to avoid sticky jumps
    };
    updateHeaderVars();
    window.addEventListener('resize', updateHeaderVars);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', updateHeaderVars);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open, profileOpen]);

  // close profile dropdown on outside click / escape
  useEffect(() => {
    if (!profileOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!headerRef.current?.contains(target)) setProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setProfileOpen(false); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (q.length === 0) return;
    router.push(`/products?q=${encodeURIComponent(q)}&page=1&limit=12`);
  }

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className={`animate-nav-in glass-transition rounded-full border ${scrolled ? 'border-slate-200 bg-white/70 backdrop-blur-lg shadow-md' : 'border-slate-200 bg-white/60 backdrop-blur-md shadow-sm'} px-3 md:px-5 py-2.5 flex items-center gap-2 md:gap-4 w-full text-[15px] md:text-base`}>
          {/* Brand */}
          <Link href="/" className="text-lg md:text-xl font-semibold tracking-[0.18em] whitespace-nowrap select-none">NeoShop</Link>

          {/* Mobile burger */}
          <button
            type="button"
            aria-label="Open menu"
            className="md:hidden ml-auto rounded-full p-2 hover:bg-white/70 transition-colors text-slate-800"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Primary nav */}
          <nav className="hidden md:flex items-center gap-1 text-base font-medium">
            {[
              { href: '/products', label: 'Products' },
              { href: '/categories', label: 'Categories' },
              { href: '/brands', label: 'Brands' },
              { href: '/orders', label: 'Orders' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link px-3 py-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-white/70 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={onSubmit} className="hidden md:flex flex-1">
            <div className="relative w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                placeholder="Search products..."
                className="w-full h-10 md:h-11 border border-slate-200 rounded-full pl-10 pr-4 bg-white/80 focus:bg-white transition-all neo-focus placeholder:text-slate-400 text-[0.95rem]"
              />
              <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700 rounded-full">
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2 md:gap-3 ml-auto">
            <Link href="/wishlist" className="relative group rounded-full p-2 hover:bg-white/70 transition-colors" aria-label="Wishlist">
              <HeartIcon filled={wishlistCount > 0} className="w-6 h-6 text-slate-900 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-slate-900 text-white rounded-full min-w-[18px] h-[18px] px-1 grid place-items-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative group rounded-full p-2 hover:bg-white/70 transition-colors" aria-label="Cart">
              <CartIcon className="w-6 h-6 text-slate-900 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-slate-900 text-white rounded-full min-w-[18px] h-[18px] px-1 grid place-items-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white/90 hover:bg-white transition-all text-sm shadow-sm"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">
                    {(session.user.name || session.user.email || 'U').slice(0,1).toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{session.user.name || session.user.email}</span>
                </button>
                {profileOpen && (
                  <div role="menu" className="absolute right-0 mt-2 bg-white/95 backdrop-blur border border-slate-200 rounded-xl shadow-lg min-w-[200px] py-2 z-50">
                    <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-500">Account</div>
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-slate-50" onClick={() => setProfileOpen(false)}>My Orders</Link>
                    <div className="border-t my-1" />
                    <button onClick={() => { setProfileOpen(false); signOut({ callbackUrl: '/' }); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-slate-900 text-white hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)] transition-all whitespace-nowrap text-sm font-medium" href="/auth">Sign In</Link>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <div className="md:hidden mt-2 glass-transition rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-lg shadow-md px-3 py-3 text-base">
            <div className="flex flex-col">
              {[
                { href: '/products', label: 'Products' },
                { href: '/categories', label: 'Categories' },
                { href: '/brands', label: 'Brands' },
                { href: '/orders', label: 'Orders' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="px-3 py-2 rounded-xl hover:bg-white/80 transition-colors text-base" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 px-3 py-2">
                <Link href="/wishlist" className="rounded-full p-2 hover:bg-white/70 transition-colors" aria-label="Wishlist" onClick={() => setOpen(false)}>
                  <HeartIcon filled={wishlistCount > 0} className="w-6 h-6 text-slate-900" />
                </Link>
                <Link href="/cart" className="rounded-full p-2 hover:bg-white/70 transition-colors" aria-label="Cart" onClick={() => setOpen(false)}>
                  <CartIcon className="w-6 h-6 text-slate-900" />
                </Link>
                {session?.user ? (
                  <button className="ml-auto inline-flex px-4 py-2 rounded-full bg-slate-900 text-white text-sm" onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }); }}>Sign out</button>
                ) : (
                  <Link className="ml-auto inline-flex px-4 py-2 rounded-full bg-slate-900 text-white text-sm" href="/auth" onClick={() => setOpen(false)}>Sign In</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
