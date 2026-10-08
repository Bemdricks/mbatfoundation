import type { Handler } from '@netlify/functions';
import { json, methodGuard, parseJsonBody } from '../lib/http';
import { paystackSecret } from '../lib/env';
import { initializeTransaction, newReference } from '../lib/paystack';
import { adminClient } from '../lib/supabase';

const CURRENCY_SYMBOLS: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };
const MIN_AMOUNTS: Record<string, number> = { NGN: 100, USD: 1, GBP: 1, EUR: 1 };

type Body = { email?: string; amount?: number | string; currency?: string; name?: string };

export const handler: Handler = async (event) => {
  const guarded = methodGuard(event);
  if (guarded) return guarded;

  const secretKey = paystackSecret();
  const supabase = adminClient();
  if (!secretKey || !supabase) {
    return json(500, { error: 'Payment service not configured' });
  }

  try {
    const { email, amount, currency, name } = parseJsonBody<Body>(event);

    if (!email || !name || !amount || !currency) {
      return json(400, { error: 'Missing required fields' });
    }

    if (!['NGN', 'USD', 'GBP', 'EUR'].includes(currency)) {
      return json(400, { error: 'Currency must be NGN, USD, GBP, or EUR' });
    }

    const parsedAmount = parseFloat(String(amount));
    const minAmount = MIN_AMOUNTS[currency];
    if (isNaN(parsedAmount) || parsedAmount < minAmount) {
      return json(400, {
        error: `Minimum donation is ${CURRENCY_SYMBOLS[currency]}${minAmount}`,
      });
    }

    const amountInSubunits = Math.round(parsedAmount * 100);
    const reference = newReference('mbat_don');

    const { error: insertError } = await supabase.from('donations').insert([
      {
        name: name.trim(),
        email: email.trim(),
        amount: parsedAmount,
        currency,
        paystack_reference: reference,
        status: 'pending',
      },
    ]);

    if (insertError) {
      return json(500, { error: 'Failed to start donation' });
    }

    const data = await initializeTransaction(secretKey, {
      email: email.trim(),
      amount: amountInSubunits,
      currency,
      reference,
      metadata: {
        type: 'donation',
        donor_name: name.trim(),
        custom_fields: [
          { display_name: 'Donor Name', variable_name: 'donor_name', value: name.trim() },
        ],
      },
    });

    if (!data.status || !data.data) {
      await supabase.from('donations').update({ status: 'failed' }).eq('paystack_reference', reference);
      return json(400, { error: data.message || 'Failed to initialize payment' });
    }

    return json(200, {
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch {
    return json(500, { error: 'Internal server error' });
  }
};
