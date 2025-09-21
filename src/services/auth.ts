const API_BASE = 'https://ecommerce.routemisr.com/api/v1';

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string; rePassword: string; phone?: string }

export async function apiLogin(payload: LoginPayload) {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to login');
  return data;
}

export async function apiRegister(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to register');
  return data;
}

export async function apiForgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/auth/forgotPasswords`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to send reset code');
  return data;
}

export async function apiVerifyReset(code: string) {
  const res = await fetch(`${API_BASE}/auth/verifyResetCode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetCode: code }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to verify code');
  return data;
}

export async function apiResetPassword(email: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/auth/resetPassword`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to reset password');
  return data;
}

// Authenticated endpoints use header 'token: <JWT>' per API
export async function apiChangeMyPassword(token: string, currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/users/changeMyPassword`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify({ currentPassword, password: newPassword, passwordConfirm: newPassword }),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to change password');
  return data;
}

export async function apiUpdateMe(token: string, payload: { name?: string; email?: string; phone?: string }) {
  const res = await fetch(`${API_BASE}/users/updateMe/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Failed to update profile');
  return data;
}

export async function apiVerifyToken(token: string) {
  const res = await fetch(`${API_BASE}/auth/verifyToken`, {
    method: 'GET',
    headers: { token },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Invalid token');
  return data;
}
