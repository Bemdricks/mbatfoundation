/*
  # Add Paystack payment fields to donations

  - `currency` (text) - NGN or USD
  - `paystack_reference` (text, unique) - Paystack transaction reference
  - `status` (text) - payment status (success, pending, failed)
*/

ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS paystack_reference text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

CREATE UNIQUE INDEX IF NOT EXISTS donations_paystack_reference_key
  ON donations (paystack_reference)
  WHERE paystack_reference IS NOT NULL;
