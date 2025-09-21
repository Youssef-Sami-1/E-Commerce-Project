import Image from 'next/image';
import Link from 'next/link';
import { fetchProduct } from '@services/products';
import RatingStars from '@components/RatingStars';
import AddToCartButton from '@components/AddToCartButton';
import WishlistToggle from '@components/WishlistToggle';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await fetchProduct(id);
  const p = data;
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 animate-fade-in" data-anim>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200">
            <Image
              src={p.imageCover}
              alt={p.title}
              width={900}
              height={900}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {Array.isArray(p.images) && p.images.length > 0 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {p.images.slice(0,5).map((img: string, i: number) => (
                <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <Image src={img} alt={`${p.title} ${i+1}`} width={200} height={200} className="w-full h-auto object-cover" sizes="(max-width: 768px) 20vw, 10vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-semibold leading-tight">{p.title}</h1>

          {/* Rating */}
          {(p.ratingsAverage || p.ratingsQuantity) && (
            <div className="mt-2">
              <RatingStars value={Number(p.ratingsAverage) || 0} count={Number(p.ratingsQuantity) || 0} />
            </div>
          )}

          {/* Brand / Category tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {p.brand?.name && (
              <Link href={`/products?brand=${p.brand._id}`} className="px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:shadow-sm">Brand: {p.brand.name}</Link>
            )}
            {p.category?.name && (
              <Link href={`/products?category=${p.category._id}`} className="px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:shadow-sm">Category: {p.category.name}</Link>
            )}
            {typeof p.sold === 'number' && <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">Sold: {p.sold}</span>}
            {typeof p.quantity === 'number' && <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">In stock: {p.quantity}</span>}
          </div>

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            <div className="text-3xl font-semibold text-slate-900">${p.price}</div>
            {p.priceAfterDiscount && p.priceAfterDiscount !== p.price && (
              <>
                <div className="text-lg line-through text-slate-400">${p.price}</div>
                <div className="text-2xl font-semibold text-emerald-600">${p.priceAfterDiscount}</div>
              </>
            )}
          </div>

          {/* Description */}
          {p.description && <p className="mt-4 text-slate-700 whitespace-pre-line">{p.description}</p>}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <AddToCartButton product={p} />
            <WishlistToggle productId={p._id} />
            {p.category?._id && (
              <Link href={`/products?category=${p.category._id}`} className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:shadow-sm">Explore similar</Link>
            )}
          </div>

          {/* Details list */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {p.brand?.name && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="text-xs uppercase tracking-wider text-slate-500">Brand</div>
                <div className="mt-1">{p.brand.name}</div>
              </div>
            )}
            {p.category?.name && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="text-xs uppercase tracking-wider text-slate-500">Category</div>
                <div className="mt-1">{p.category.name}</div>
              </div>
            )}
            {p.subcategory?.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white sm:col-span-2">
                <div className="text-xs uppercase tracking-wider text-slate-500">Subcategories</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {p.subcategory.map((sc: any) => (
                    <span key={sc._id} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">{sc.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
