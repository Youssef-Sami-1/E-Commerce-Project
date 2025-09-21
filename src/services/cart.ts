const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function getCart(token: string) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'GET',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch cart');
  return data;
}

export async function addToCartApi(token: string, productId: string) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify({ productId }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to add to cart');
  return data;
}

export async function updateCartItem(token: string, productId: string, count: number) {
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify({ count }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to update cart item');
  return data;
}

export async function removeCartItem(token: string, productId: string) {
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'DELETE',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to remove cart item');
  return data;
}

export async function clearCartApi(token: string) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'DELETE',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to clear cart');
  return data;
}
