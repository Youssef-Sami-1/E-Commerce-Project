const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function fetchProducts(params?: { category?: string; brand?: string; sort?: string; page?: number; limit?: number; q?: string }) {
  const url = new URL(`${API_BASE}/products`);
  if (params?.category) url.searchParams.set('category[in]', params.category);
  if (params?.brand) url.searchParams.set('brand[in]', params.brand);
  if (params?.sort) url.searchParams.set('sort', params.sort);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));
  if (params?.q) url.searchParams.set('keyword', params.q);
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}
