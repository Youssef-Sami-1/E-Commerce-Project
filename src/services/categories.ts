const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}
