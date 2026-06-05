// HMAC-SHA256 signing helpers for deep links.
// Uses Web Crypto (available in Cloudflare Pages Functions).

export interface Payload {
  v: 1;
  act: string;
  params: Record<string, string>;
  iat: number;
  exp: number;
  jti: string;
}

const enc = new TextEncoder();

function b64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function sign(payload: Payload, secret: string): Promise<string> {
  const dataB64 = b64urlEncode(enc.encode(JSON.stringify(payload)));
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(dataB64));
  return `${dataB64}.${b64urlEncode(sig)}`;
}

export async function verify(
  token: string,
  secret: string,
): Promise<{ ok: true; payload: Payload } | { ok: false; reason: string }> {
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, reason: 'malformed' };
  const [dataB64, sigB64] = parts;
  const key = await importKey(secret);
  let valid = false;
  try {
    valid = await crypto.subtle.verify('HMAC', key, b64urlDecode(sigB64), enc.encode(dataB64));
  } catch {
    return { ok: false, reason: 'sig-decode' };
  }
  if (!valid) return { ok: false, reason: 'bad-signature' };
  let payload: Payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(b64urlDecode(dataB64)));
  } catch {
    return { ok: false, reason: 'payload-decode' };
  }
  if (payload.v !== 1) return { ok: false, reason: 'bad-version' };
  if (Math.floor(Date.now() / 1000) > payload.exp) return { ok: false, reason: 'expired' };
  return { ok: true, payload };
}

export function randomJti(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return b64urlEncode(b);
}
