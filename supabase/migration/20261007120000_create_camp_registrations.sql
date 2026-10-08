/*
  # Create camp_registrations table

  1. New Table
    - `camp_registrations`
      - Participant details for the Dec 2026 basketball camp/tournament
      - Guardian/emergency contact for minors and next of kin
      - Optional medical notes and kit size

  2. Security
    - Enable RLS
    - Allow anonymous INSERT for public registrations
    - No public SELECT (admin access only via service role)
*/

CREATE TABLE IF NOT EXISTS camp_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL DEFAULT 'dec_2026_camp',
  full_name text NOT NULL DEFAULT '',
  gender text NOT NULL DEFAULT '',
  age integer NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  experience text NOT NULL DEFAULT '',
  guardian_name text NOT NULL DEFAULT '',
  guardian_phone text NOT NULL DEFAULT '',
  tshirt_size text NOT NULL DEFAULT '',
  medical_notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE camp_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a camp registration"
  ON camp_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
