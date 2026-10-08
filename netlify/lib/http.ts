import type { HandlerEvent, HandlerResponse } from '@netlify/functions';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-paystack-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(statusCode: number, body: unknown): HandlerResponse {
  return {
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export function optionsResponse(): HandlerResponse {
  return { statusCode: 204, headers: corsHeaders, body: '' };
}

export function methodGuard(event: HandlerEvent): HandlerResponse | null {
  if (event.httpMethod === 'OPTIONS') return optionsResponse();
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  return null;
}

export function parseJsonBody<T>(event: HandlerEvent): T {
  const raw = rawBody(event);
  if (!raw) return {} as T;
  return JSON.parse(raw) as T;
}

export function rawBody(event: HandlerEvent): string {
  if (!event.body) return '';
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, 'base64').toString('utf8');
  }
  return event.body;
}
