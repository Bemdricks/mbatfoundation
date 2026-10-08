import { createHmac, timingSafeEqual } from 'node:crypto';

export type PaystackInitPayload = {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  metadata?: Record<string, unknown>;
};

export type PaystackTransaction = {
  status: string;
  amount: number;
  currency: string;
  reference: string;
  email?: string;
  customer?: { email?: string; first_name?: string };
  metadata?: Record<string, unknown>;
};

function authHeaders(secret: string) {
  return {
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  };
}

export function paystackSecret() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY is not set');
  return secret;
}

export function newReference(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function initializeTransaction(payload: PaystackInitPayload) {
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: authHeaders(paystackSecret()),
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<{
    status: boolean;
    message?: string;
    data?: { access_code: string; reference: string };
  }>;
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${paystackSecret()}` } },
  );
  return res.json() as Promise<{
    status: boolean;
    message?: string;
    data?: PaystackTransaction;
  }>;
}

export function signatureIsValid(rawBody: string, signature: string | undefined) {
  if (!signature) return false;
  const hash = createHmac('sha512', paystackSecret()).update(rawBody).digest('hex');
  const expected = Buffer.from(hash);
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function isSuccessfulCharge(tx: PaystackTransaction | undefined) {
  return Boolean(tx && tx.status === 'success');
}

export function paymentKind(tx: PaystackTransaction): 'donation' | 'camp_registration' | null {
  const metaType = tx.metadata?.type;
  if (metaType === 'donation' || metaType === 'camp_registration') return metaType;
  if (tx.reference?.startsWith('mbat_camp_')) return 'camp_registration';
  if (tx.reference?.startsWith('mbat_don_') || tx.reference?.startsWith('mbat_')) return 'donation';
  return null;
}
