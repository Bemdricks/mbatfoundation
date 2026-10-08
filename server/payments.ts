import { CAMP_FEE_KOBO, CAMP_FEE_NGN } from './camp';
import { CampRegistration, Donation } from './models';
import type { PaystackTransaction } from './paystack';

export async function recordSuccessfulDonation(tx: PaystackTransaction, fallbackName?: string) {
  const donorName =
    (typeof tx.metadata?.donor_name === 'string' && tx.metadata.donor_name) ||
    tx.customer?.first_name ||
    fallbackName ||
    'Anonymous';
  const email = tx.customer?.email || tx.email || '';
  const amount = tx.amount / 100;
  const reference = tx.reference;

  const existing = await Donation.findOne({ paystack_reference: reference });
  if (existing?.status === 'success') {
    return { amount: Number(existing.amount), currency: existing.currency as string, reference };
  }

  if (existing) {
    existing.name = donorName;
    existing.email = email;
    existing.amount = amount;
    existing.currency = tx.currency;
    existing.status = 'success';
    await existing.save();
  } else {
    await Donation.create({
      name: donorName,
      email,
      amount,
      currency: tx.currency,
      paystack_reference: reference,
      status: 'success',
    });
  }

  return { amount, currency: tx.currency, reference };
}

export async function recordSuccessfulCampPayment(tx: PaystackTransaction) {
  if (tx.currency !== 'NGN' || tx.amount !== CAMP_FEE_KOBO) {
    throw new Error('Camp fee amount mismatch');
  }

  const reference = tx.reference;
  const registrationId =
    typeof tx.metadata?.registration_id === 'string' ? tx.metadata.registration_id : null;

  let existing = await CampRegistration.findOne({ paystack_reference: reference });

  if (!existing && registrationId) {
    existing = await CampRegistration.findById(registrationId);
    if (existing && existing.payment_status !== 'success') {
      existing.payment_status = 'success';
      existing.paystack_reference = reference;
      await existing.save();
    }
    if (existing) {
      return { amount: CAMP_FEE_NGN, currency: 'NGN', reference };
    }
  }

  if (existing?.payment_status === 'success') {
    return { amount: CAMP_FEE_NGN, currency: 'NGN', reference };
  }

  if (!existing) {
    throw new Error('Camp registration not found');
  }

  existing.payment_status = 'success';
  await existing.save();
  return { amount: CAMP_FEE_NGN, currency: 'NGN', reference };
}
