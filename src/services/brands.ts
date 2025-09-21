const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}
