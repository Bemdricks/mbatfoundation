export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

interface InitializeResponse {
  access_code: string;
  reference: string;
  amount?: number;
  currency?: string;
}

interface VerifyResponse {
  verified: boolean;
  amount?: number;
  currency?: string;
  reference?: string;
  message?: string;
}

export type CampRegistrationPayload = {
  full_name: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  age_group: string;
  position: string;
  experience: string;
  guardian_name: string;
  guardian_phone: string;
  tshirt_size: string;
  medical_notes: string;
};

function apiBase() {
  const configured = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  return configured || '/api';
}

async function post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${apiBase()}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || 'Request failed');
  }
  return data as T;
}

export async function initializeDonation(params: {
  email: string;
  amount: number;
  currency: Currency;
  name: string;
}): Promise<InitializeResponse> {
  return post<InitializeResponse>('initialize-donation', params);
}

export async function verifyDonation(reference: string): Promise<VerifyResponse> {
  return post<VerifyResponse>('verify-donation', { reference });
}

export async function initializeCampRegistration(
  params: CampRegistrationPayload,
): Promise<InitializeResponse> {
  return post<InitializeResponse>('initialize-camp-registration', params);
}

export async function verifyCampRegistration(reference: string): Promise<VerifyResponse> {
  return post<VerifyResponse>('verify-camp-registration', { reference });
}

export async function submitContact(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ ok: boolean }> {
  return post<{ ok: boolean }>('submit-contact', params);
}

export type { InitializeResponse, VerifyResponse };
