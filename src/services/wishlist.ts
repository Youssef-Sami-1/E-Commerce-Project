const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function addToWishlist(token: string, productId: string) {
  const res = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify({ productId }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to add to wishlist');
  return data;
}

export async function removeFromWishlist(token: string, productId: string) {
  const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
    method: 'DELETE',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to remove from wishlist');
  return data;
}

export async function getWishlist(token: string) {
  const res = await fetch(`${API_BASE}/wishlist`, {
    method: 'GET',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch wishlist');
  return data;
}
