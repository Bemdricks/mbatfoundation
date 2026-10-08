import type { Handler } from '@netlify/functions';
import { json, methodGuard, parseJsonBody } from '../lib/http';
import { paystackSecret } from '../lib/env';
import { adminClient } from '../lib/supabase';
import { initializeTransaction, newReference } from '../lib/paystack';
import {
  CAMP_EVENT,
  CAMP_FEE_KOBO,
  CAMP_FEE_NGN,
  campRow,
  validateCampRegistration,
  type CampRegistrationInput,
} from '../lib/camp';

export const handler: Handler = async (event) => {
  const guarded = methodGuard(event);
  if (guarded) return guarded;

  const secretKey = paystackSecret();
  const supabase = adminClient();
  if (!secretKey || !supabase) {
    return json(500, { error: 'Payment service not configured' });
  }

  try {
    const body = parseJsonBody<CampRegistrationInput>(event);
    const validationError = validateCampRegistration(body);
    if (validationError) return json(400, { error: validationError });

    const reference = newReference('mbat_camp');
    const row = campRow(body, reference);

    const { data: inserted, error: insertError } = await supabase
      .from('camp_registrations')
      .insert([row])
      .select('id')
      .single();

    if (insertError || !inserted) {
      return json(500, { error: 'Failed to start registration' });
    }

    const data = await initializeTransaction(secretKey, {
      email: row.email,
      amount: CAMP_FEE_KOBO,
      currency: 'NGN',
      reference,
      metadata: {
        type: 'camp_registration',
        event: CAMP_EVENT,
        registration_id: inserted.id,
        participant_name: row.full_name,
        custom_fields: [
          { display_name: 'Participant', variable_name: 'participant_name', value: row.full_name },
          { display_name: 'Camp fee', variable_name: 'camp_fee', value: `NGN ${CAMP_FEE_NGN}` },
        ],
      },
    });

    if (!data.status || !data.data) {
      await supabase.from('camp_registrations').delete().eq('id', inserted.id);
      return json(400, { error: data.message || 'Failed to initialize payment' });
    }

    return json(200, {
      access_code: data.data.access_code,
      reference: data.data.reference,
      amount: CAMP_FEE_NGN,
      currency: 'NGN',
    });
  } catch {
    return json(500, { error: 'Internal server error' });
  }
};
