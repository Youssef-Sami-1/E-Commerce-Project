import { fetchCategories } from '@services/categories';
import CategoryCard from '@components/CategoryCard';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const metadata = {
  title: 'Categories — NeoShop',
  alternates: { canonical: `${base}/categories` },
};

export default async function CategoriesPage() {
  const { data: categories = [] } = await fetchCategories();
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        {categories.map((c: any) => (
          <CategoryCard key={c._id} id={c._id} name={c.name} image={c.image} />
        ))}
      </div>
    </section>
  );
}
