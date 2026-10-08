/*
  Backend writes go through Netlify Functions using the service role.
  Remove public INSERT policies so the anon key cannot write tables directly.
  Add Paystack fields for camp registration fees.
*/

ALTER TABLE camp_registrations
  ADD COLUMN IF NOT EXISTS fee_amount numeric NOT NULL DEFAULT 1000,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'NGN',
  ADD COLUMN IF NOT EXISTS paystack_reference text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';

CREATE UNIQUE INDEX IF NOT EXISTS camp_registrations_paystack_reference_key
  ON camp_registrations (paystack_reference)
  WHERE paystack_reference IS NOT NULL;

DROP POLICY IF EXISTS "Anyone can submit a camp registration" ON camp_registrations;
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can submit a donation" ON donations;
