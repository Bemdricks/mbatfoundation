import type { Handler } from '@netlify/functions';
import { json, methodGuard, parseJsonBody } from '../lib/http';
import { adminClient } from '../lib/supabase';

const SUBJECTS = [
  'Donation Inquiry',
  'Basketball Camp',
  'Volunteer Application',
  'Partnership Opportunity',
  'Program Information',
  'Media & Press',
  'Other',
];

type Body = { name?: string; email?: string; subject?: string; message?: string };

export const handler: Handler = async (event) => {
  const guarded = methodGuard(event);
  if (guarded) return guarded;

  const supabase = adminClient();
  if (!supabase) {
    return json(500, { error: 'Contact service not configured' });
  }

  try {
    const { name, email, subject, message } = parseJsonBody<Body>(event);
    const trimmed = {
      name: name?.trim() || '',
      email: email?.trim() || '',
      subject: subject?.trim() || '',
      message: message?.trim() || '',
    };

    if (!trimmed.name || !trimmed.email || !trimmed.subject || !trimmed.message) {
      return json(400, { error: 'Missing required fields' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      return json(400, { error: 'Enter a valid email address' });
    }
    if (!SUBJECTS.includes(trimmed.subject)) {
      return json(400, { error: 'Select a valid subject' });
    }
    if (trimmed.message.length > 5000) {
      return json(400, { error: 'Message is too long' });
    }

    const { error } = await supabase.from('contact_messages').insert([trimmed]);
    if (error) return json(500, { error: 'Failed to send message' });

    return json(200, { ok: true });
  } catch {
    return json(500, { error: 'Internal server error' });
  }
};
