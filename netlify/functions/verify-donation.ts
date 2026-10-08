import type { Handler } from '@netlify/functions';
import { json, methodGuard, parseJsonBody } from '../lib/http';
import { paystackSecret } from '../lib/env';
import { adminClient } from '../lib/supabase';
import { isSuccessfulCharge, verifyTransaction } from '../lib/paystack';
import { recordSuccessfulDonation } from '../lib/payments';

type Body = { reference?: string };

export const handler: Handler = async (event) => {
  const guarded = methodGuard(event);
  if (guarded) return guarded;

  const secretKey = paystackSecret();
  const supabase = adminClient();
  if (!secretKey || !supabase) {
    return json(500, { error: 'Payment service not configured' });
  }

  try {
    const { reference } = parseJsonBody<Body>(event);
    if (!reference) return json(400, { error: 'Missing payment reference' });

    const verified = await verifyTransaction(secretKey, reference);
    if (!verified.status || !isSuccessfulCharge(verified.data)) {
      return json(400, { error: 'Payment not completed' });
    }

    const recorded = await recordSuccessfulDonation(supabase, verified.data!);
    return json(200, { verified: true, ...recorded });
  } catch {
    return json(500, { error: 'Internal server error' });
  }
};
