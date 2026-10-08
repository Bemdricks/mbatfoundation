import type { Handler } from '@netlify/functions';
import { json, rawBody } from '../lib/http';
import { paystackSecret } from '../lib/env';
import { adminClient } from '../lib/supabase';
import { isSuccessfulCharge, signatureIsValid, type PaystackTransaction } from '../lib/paystack';
import { paymentKind, recordSuccessfulCampPayment, recordSuccessfulDonation } from '../lib/payments';

type WebhookPayload = {
  event?: string;
  data?: PaystackTransaction;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const secretKey = paystackSecret();
  const supabase = adminClient();
  if (!secretKey || !supabase) {
    return json(500, { error: 'Payment service not configured' });
  }

  const body = rawBody(event);
  const signature = event.headers['x-paystack-signature'] || event.headers['X-Paystack-Signature'];
  if (!signatureIsValid(body, signature, secretKey)) {
    return json(401, { error: 'Invalid signature' });
  }

  try {
    const payload = JSON.parse(body) as WebhookPayload;
    if (payload.event !== 'charge.success' || !isSuccessfulCharge(payload.data)) {
      return json(200, { received: true });
    }

    const tx = payload.data!;
    const kind = paymentKind(tx);

    if (kind === 'camp_registration') {
      await recordSuccessfulCampPayment(supabase, tx);
    } else if (kind === 'donation') {
      await recordSuccessfulDonation(supabase, tx);
    }

    return json(200, { received: true });
  } catch {
    return json(500, { error: 'Webhook processing failed' });
  }
};
