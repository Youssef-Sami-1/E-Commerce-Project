const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function fetchOrders(token: string) {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { token },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function createCheckoutSession(token: string, cartId: string, baseUrl: string) {
  const url = `${API_BASE}/orders/checkout-session/${encodeURIComponent(cartId)}?url=${encodeURIComponent(baseUrl)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to create checkout session');
  return data;
}

export async function createCashOrder(token: string, cartId: string) {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(cartId)}`, {
    method: 'POST',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to create cash order');
  return data;
}

export async function fetchOrder(token: string, id: string) {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch order');
  return data;
}

export async function cancelOrder(token: string, id: string) {
  // Try DELETE /orders/:id; if API differs, adjust here accordingly
  let res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { token },
    cache: 'no-store',
  });
  if (res.status === 404) {
    // fallback common pattern
    res = await fetch(`${API_BASE}/orders/cancel/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: { token },
      cache: 'no-store',
    });
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to cancel order');
  return data;
}
