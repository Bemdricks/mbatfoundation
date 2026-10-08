export function requireEnv(keys: string[]): Record<string, string> | { error: string } {
  const values: Record<string, string> = {};
  for (const key of keys) {
    const value = process.env[key];
    if (!value) return { error: 'Server is not configured' };
    values[key] = value;
  }
  return values;
}

export function paystackSecret(): string | null {
  return process.env.PAYSTACK_SECRET_KEY || null;
}

export function supabaseConfig(): { url: string; serviceRoleKey: string } | null {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}
