<div align="center">

# NeoShop — Modern E‑commerce (Next.js + TypeScript)

Sleek, fast, and effortless shopping. Built with Next.js App Router, TypeScript, Tailwind, NextAuth, Redux Toolkit, and native Fetch.

</div>

## Tech Stack

- Next.js 15 (App Router, `src/`, TypeScript, Turbopack)
- React 19
- Tailwind CSS v4
- NextAuth (Credentials)
- Redux Toolkit + React‑Redux
- Native Fetch API (no Axios)

## Live Data API

We use the RouteMisr E‑commerce API.
Base URL: `https://ecommerce.routemisr.com/api/v1`

## Features

- Auth: Login, Register, Forgot/Reset Password (single `/auth` page, no tabs, inline links)
- Password eye toggles and clear red error on wrong credentials
- Product Listing, Product Detail
- Cart with full backend sync (add, quantity +/−, remove, clear on order)
- Checkout: address list/add/remove/selection, proceed to payment (session) or fallback cash order
- Orders: list and detail pages, full-card navigation
- Wishlist: toggle on cards and product detail, optimistic + server sync
- Global sign‑in prompt modal for guests (Shown on add to cart or wishlisting when not signed in)
- Header profile dropdown opens on click (not hover), closes on outside/ESC
- Contact page (demo form)
- Polished loading states and disabled buttons for slow actions

## Environment Variables

Create `.env.local` in the project root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_long_random_secret
# Public site URL used for checkout return URLs (set to your Vercel URL in production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Notes:
- In production (Vercel), set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your deployed domain, e.g. `https://your-app.vercel.app`.

## Getting Started (Local)

1. Install deps
   ```bash
   npm install
   ```
2. Run dev server
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

## Project Structure (Key Paths)

```
src/
  app/
    page.tsx                 # Home
    auth/page.tsx            # Auth (login/register/forgot/reset)
    products/page.tsx
    products/[id]/page.tsx
    wishlist/page.tsx
    cart/page.tsx
    checkout/page.tsx
    orders/page.tsx
    orders/[id]/page.tsx
    contact/page.tsx
    api/auth/[...nextauth]/route.ts
    layout.tsx
  components/
    Header.tsx
    Footer.tsx
    ProductCard.tsx
    AddToCartButton.tsx
    WishlistToggle.tsx
    AuthForm.tsx
    Providers.tsx
    auth/AuthPromptProvider.tsx
  redux/
    store.ts
    slices/
      cartSlice.ts
      wishlistSlice.ts
  services/
    auth.ts
    products.ts
    categories.ts
    brands.ts
    cart.ts
    addresses.ts
    orders.ts
```

## GitHub: Initialize and Push

From the project root:

```bash
# 1) Initialize git (if not already)
git init

# 2) Ensure useful ignores are in place (see .gitignore)
# .env.local is ignored so secrets won't be committed

# 3) Create initial commit
git add -A
git commit -m "chore: initial commit"

# 4) Create a new GitHub repo (via GitHub UI), then add the remote
git remote add origin https://github.com/<your-username>/<your-repo>.git

# 5) Push
git branch -M main
git push -u origin main
```

## Deploy on Vercel

1. Go to https://vercel.com/import and select your GitHub repo.
2. Framework Preset: Next.js (detected automatically).
3. Add Environment Variables (same as `.env.local`):
   - `NEXTAUTH_URL` = `https://<your-app>.vercel.app`
   - `NEXT_PUBLIC_SITE_URL` = `https://<your-app>.vercel.app`
   - `NEXTAUTH_SECRET` = your long random secret
4. Deploy.
5. After first deploy, verify:
   - Auth redirect works on `/auth`
   - Checkout session redirects back to your domain (uses `NEXT_PUBLIC_SITE_URL`)

## Image Domains (Optional)

If your product images come from external hosts, ensure they’re allowed in `next.config.ts` under `images.remotePatterns`.

## Notes & Maintenance

- `.gitignore` excludes `node_modules/`, build outputs, `.env*`, `.vercel/`, logs, and TypeScript cache files.
- All network requests use `fetch` with a `token` header for authenticated endpoints.
- Stripe/checkout session is created via `orders/checkout-session/:cartId?url=`; ensure `NEXT_PUBLIC_SITE_URL` matches your domain.
- For new features, prefer adding small, focused components inside `src/components/` and colocating service calls under `src/services/`.

---

MIT © Route Front-End Final Project — Youssef Sami Yehia
