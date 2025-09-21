import { fetchCategories } from '@services/categories';
import { fetchBrands } from '@services/brands';
import { fetchProducts } from '@services/products';
import CategoryCard from '@components/CategoryCard';
import BrandCard from '@components/BrandCard';
import ProductCard from '@components/ProductCard';
import Image from 'next/image';
import BrandsMarquee from '@components/BrandsMarquee';

export default async function Home() {
  const [{ data: categories = [] } = {} as any, { data: brands = [] } = {} as any, { data: products = [] } = {} as any] = await Promise.all([
    fetchCategories(),
    fetchBrands(),
    fetchProducts({ sort: '-sold' }),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero: full-bleed image with overlay CTAs */}
      <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden animate-fade-in reveal-up" data-anim>
        <Image
          src="https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1920&auto=format&fit=crop"
          alt="Futuristic shopping hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/30 to-transparent" />
        {/* Bottom fade to connect hero with next sections */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-40 bg-gradient-to-b from-transparent to-white" />
        <div className="relative z-10 max-w-6xl mx-auto h-full px-4 flex items-end md:items-center">
          <div className="pb-10 md:pb-0 load-stagger">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900">Shop the Future</h1>
            <p className="mt-3 text-slate-700 max-w-xl">Minimal, fast, and beautiful. Explore categories, brands, and the latest trending products.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/products" className="px-5 py-2.5 rounded-full bg-slate-900 text-white hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-all text-center">Shop Products</a>
              <a href="/categories" className="px-5 py-2.5 rounded-full border border-slate-300 bg-white/80 hover:bg-white transition-all text-center">Browse Categories</a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <section className="reveal-up">
          <div className="flex items-center justify-between mb-4 reveal-up">
            <h2 className="text-xl font-semibold">Categories</h2>
            <a
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-slate-200 bg-white/80 hover:bg-white hover:shadow-sm transition-all"
              href="/categories"
            >
              View more
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors">→</span>
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger reveal-up">
            {categories.slice(0, 8).map((c: any) => (
              <CategoryCard key={c._id} id={c._id} name={c.name} image={c.image} />
            ))}
          </div>
        </section>

        <div className="section-divider my-6 reveal-up" />

        <section className="reveal-up">
          <BrandsMarquee brands={brands} />
        </section>

        <div className="section-divider my-6 reveal-up" />

        <section className="reveal-up">
          <div className="flex items-center justify-between mb-4 reveal-up">
            <h2 className="text-xl font-semibold">Featured Products</h2>
            <a
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-slate-200 bg-white/80 hover:bg-white hover:shadow-sm transition-all"
              href="/products"
            >
              View more
              <span className="text-slate-400 group-hover:text-slate-600 transition-colors">→</span>
            </a>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 stagger reveal-up">
            {products.slice(0, 12).map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
