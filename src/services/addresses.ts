const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export type AddressPayload = {
  name: string;
  details: string;
  phone: string;
  city: string;
};

export async function getAddresses(token: string) {
  const res = await fetch(`${API_BASE}/addresses`, {
    method: 'GET',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch addresses');
  return data;
}

export async function getAddress(token: string, id: string) {
  const res = await fetch(`${API_BASE}/addresses/${id}`, {
    method: 'GET',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch address');
  return data;
}

export async function addAddress(token: string, payload: AddressPayload) {
  const res = await fetch(`${API_BASE}/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to add address');
  return data;
}

export async function removeAddress(token: string, id: string) {
  const res = await fetch(`${API_BASE}/addresses/${id}`, {
    method: 'DELETE',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to remove address');
  return data;
}
