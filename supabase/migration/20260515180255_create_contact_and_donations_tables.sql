/*
  # Create contact_messages and donations tables

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text) - sender's full name
      - `email` (text) - sender's email
      - `subject` (text) - message subject
      - `message` (text) - message body
      - `created_at` (timestamptz)
    - `donations`
      - `id` (uuid, primary key)
      - `name` (text) - donor's name
      - `email` (text) - donor's email
      - `amount` (numeric) - donation amount in USD
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow anonymous INSERT for public form submissions
    - No public SELECT (admin access only via service role)
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a donation"
  ON donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
