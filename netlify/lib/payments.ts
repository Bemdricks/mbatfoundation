import type { SupabaseClient } from '@supabase/supabase-js';
import { CAMP_FEE_KOBO, CAMP_FEE_NGN } from './camp';
import type { PaystackTransaction } from './paystack';

export async function recordSuccessfulDonation(
  supabase: SupabaseClient,
  tx: PaystackTransaction,
  fallbackName?: string,
) {
  const donorName =
    (typeof tx.metadata?.donor_name === 'string' && tx.metadata.donor_name) ||
    tx.customer?.first_name ||
    fallbackName ||
    'Anonymous';
  const email = tx.customer?.email || tx.email || '';
  const amount = tx.amount / 100;
  const reference = tx.reference;

  const { data: existing } = await supabase
    .from('donations')
    .select('id, amount, currency, status')
    .eq('paystack_reference', reference)
    .maybeSingle();

  if (existing?.status === 'success') {
    return { amount: Number(existing.amount), currency: existing.currency as string, reference };
  }

  if (existing) {
    const { error } = await supabase
      .from('donations')
      .update({
        name: donorName,
        email,
        amount,
        currency: tx.currency,
        status: 'success',
      })
      .eq('id', existing.id);
    if (error) throw new Error('Failed to record donation');
  } else {
    const { error } = await supabase.from('donations').insert([
      {
        name: donorName,
        email,
        amount,
        currency: tx.currency,
        paystack_reference: reference,
        status: 'success',
      },
    ]);
    if (error) throw new Error('Failed to record donation');
  }

  return { amount, currency: tx.currency, reference };
}

export async function recordSuccessfulCampPayment(
  supabase: SupabaseClient,
  tx: PaystackTransaction,
) {
  if (tx.currency !== 'NGN' || tx.amount !== CAMP_FEE_KOBO) {
    throw new Error('Camp fee amount mismatch');
  }

  const reference = tx.reference;
  const registrationId =
    typeof tx.metadata?.registration_id === 'string' ? tx.metadata.registration_id : null;

  const { data: existing } = await supabase
    .from('camp_registrations')
    .select('id, payment_status')
    .eq('paystack_reference', reference)
    .maybeSingle();

  if (!existing && registrationId) {
    const { data: byId } = await supabase
      .from('camp_registrations')
      .select('id, payment_status')
      .eq('id', registrationId)
      .maybeSingle();
    if (byId?.payment_status === 'success') {
      return { amount: CAMP_FEE_NGN, currency: 'NGN', reference };
    }
    if (byId) {
      const { error } = await supabase
        .from('camp_registrations')
        .update({ payment_status: 'success', paystack_reference: reference })
        .eq('id', byId.id);
      if (error) throw new Error('Failed to record camp payment');
      return { amount: CAMP_FEE_NGN, currency: 'NGN', reference };
    }
  }

  if (existing?.payment_status === 'success') {
    return { amount: CAMP_FEE_NGN, currency: 'NGN', reference };
  }

  if (!existing) {
    throw new Error('Camp registration not found');
  }

  const { error } = await supabase
    .from('camp_registrations')
    .update({ payment_status: 'success' })
    .eq('id', existing.id);
  if (error) throw new Error('Failed to record camp payment');

  return { amount: CAMP_FEE_NGN, currency: 'NGN', reference };
}

export function paymentKind(tx: PaystackTransaction): 'donation' | 'camp_registration' | null {
  const metaType = tx.metadata?.type;
  if (metaType === 'donation' || metaType === 'camp_registration') return metaType;
  if (tx.reference?.startsWith('mbat_camp_')) return 'camp_registration';
  if (tx.reference?.startsWith('mbat_don_') || tx.reference?.startsWith('mbat_')) return 'donation';
  return null;
}
