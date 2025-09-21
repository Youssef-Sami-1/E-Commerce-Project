import { fetchBrands } from '@services/brands';
import BrandCard from '@components/BrandCard';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata = {
  title: 'Brands — NeoShop',
  alternates: { canonical: `${base}/brands` },
};

export default async function BrandsPage() {
  const { data: brands = [] } = await fetchBrands();
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Brands</h1>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 stagger">
        {brands.map((b: any) => (
          <BrandCard key={b._id} id={b._id} name={b.name} image={b.image} />
        ))}
      </div>
    </section>
  );
}
