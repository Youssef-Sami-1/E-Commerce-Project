import { fetchProducts } from '@services/products';
import { fetchCategories } from '@services/categories';
import { fetchBrands } from '@services/brands';
import ProductCard from '@components/ProductCard';
import Link from 'next/link';
import ProductsFiltersClient from '@components/ProductsFiltersClient';
// Desktop sidebar will be rendered as a normal static aside that scrolls with content

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata = {
  title: 'Products — NeoShop',
  alternates: { canonical: `${base}/products` },
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string; brand?: string; sort?: string; page?: string; limit?: string; q?: string }> }) {
  const sp = await searchParams;
  const category = sp.category;
  const brand = sp.brand;
  const sort = sp.sort;
  const q = sp.q;
  const page = sp.page ? Math.max(parseInt(sp.page as string, 10) || 1, 1) : 1;
  const limit = sp.limit ? Math.max(parseInt(sp.limit as string, 10) || 12, 1) : 12;

  const [res, catsRes, brandsRes] = await Promise.all([
    fetchProducts({ category, brand, sort, page, limit, q }),
    fetchCategories(),
    fetchBrands(),
  ]);
  const products = res?.data ?? [];
  const metadata = (res as any)?.metadata;
  const currentPage = metadata?.currentPage ?? page;
  const numberOfPages = metadata?.numberOfPages as number | undefined;
  const hasNext = numberOfPages ? currentPage < numberOfPages : products.length === limit;
  const hasPrev = currentPage > 1;

  const categories = (catsRes as any)?.data ?? [];
  const brands = (brandsRes as any)?.data ?? [];

  // helper to build links keeping filters
  const buildHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (brand) params.set('brand', brand);
    if (sort) params.set('sort', sort);
    if (q) params.set('q', q);
    params.set('page', String(nextPage));
    params.set('limit', String(limit));
    return `/products?${params.toString()}`;
  };

  const buildQuery = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (patch.category ?? category) params.set('category', (patch.category ?? category) as string);
    if (patch.brand ?? brand) params.set('brand', (patch.brand ?? brand) as string);
    if (patch.sort ?? sort) params.set('sort', (patch.sort ?? sort) as string);
    if (q) params.set('q', q);
    params.set('page', '1');
    params.set('limit', String(limit));
    return `/products?${params.toString()}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pt-24 md:pt-10 pb-10">
      <div className="flex items-center justify-between mb-6 reveal-up">
        <h1 className="text-3xl font-semibold">Products</h1>
        {/* Mobile filters */}
        <ProductsFiltersClient
          categories={categories}
          brands={brands}
          category={category}
          brand={brand}
          sort={sort}
          limit={limit}
          q={q}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Desktop filters (static within column, scrolls with content) */}
        <aside className="hidden md:block" data-testid="desktop-filters">
          <div className="space-y-5" data-testid="desktop-filters-floater">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Sort</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Default', value: '' },
                  { label: 'Price: Low to High', value: 'price' },
                  { label: 'Price: High to Low', value: '-price' },
                  { label: 'Most Popular', value: '-sold' },
                  { label: 'Newest', value: '-createdAt' },
                ].map((s) => (
                  <Link
                    key={s.label}
                    href={buildQuery({ sort: s.value || undefined })}
                    className={`px-3 py-2 rounded-full border text-sm ${!sort && s.value === '' ? 'bg-slate-900 text-white border-slate-900' : sort === s.value ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white hover:shadow-sm'}`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Categories</div>
              <div className="flex flex-col gap-2 max-h-[340px] overflow-auto pr-1">
                <Link
                  href={buildQuery({ category: undefined })}
                  className={`px-3 py-2 rounded-full border text-sm ${!category ? 'bg-slate-900 text-white' : 'bg-white border-slate-200 hover:shadow-sm'}`}
                >
                  All
                </Link>
                {categories.map((c: any) => (
                  <Link
                    key={c._id}
                    href={buildQuery({ category: c._id })}
                    className={`px-3 py-2 rounded-full border text-sm ${category === c._id ? 'bg-slate-900 text-white' : 'bg-white border-slate-200 hover:shadow-sm'}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Brands</div>
              <div className="flex flex-col gap-2 max-h-[340px] overflow-auto pr-1">
                <Link
                  href={buildQuery({ brand: undefined })}
                  className={`px-3 py-2 rounded-full border text-sm ${!brand ? 'bg-slate-900 text-white' : 'bg-white border-slate-200 hover:shadow-sm'}`}
                >
                  All
                </Link>
                {brands.map((b: any) => (
                  <Link
                    key={b._id}
                    href={buildQuery({ brand: b._id })}
                    className={`px-3 py-2 rounded-full border text-sm ${brand === b._id ? 'bg-slate-900 text-white' : 'bg-white border-slate-200 hover:shadow-sm'}`}
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 stagger">
            {products.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between reveal-up">
            <Link
              aria-disabled={!hasPrev}
              className={`px-4 py-2 rounded-full border border-slate-200 ${hasPrev ? 'bg-white hover:shadow-sm' : 'opacity-50 pointer-events-none'}`}
              href={hasPrev ? buildHref(currentPage - 1) : '#'}
            >
              ← Prev
            </Link>
            <div className="text-sm text-slate-600">
              Page {currentPage}
              {numberOfPages ? ` of ${numberOfPages}` : ''}
            </div>
            <Link
              aria-disabled={!hasNext}
              className={`px-4 py-2 rounded-full border border-slate-200 ${hasNext ? 'bg-white hover:shadow-sm' : 'opacity-50 pointer-events-none'}`}
              href={hasNext ? buildHref(currentPage + 1) : '#'}
            >
              Next →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
