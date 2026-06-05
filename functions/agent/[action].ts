// Bot-facing mint endpoint.
// GET /agent/<action>?<params>  -> plain text / markdown with a freshly signed URL.
// Designed so ChatGPT browsing / Claude web fetch can read the link out of the body.

import { sign, randomJti, type Payload } from '../_shared/sign';

interface Env {
  LINK_SIGNING_KEY: string;
  LINK_TTL_SECONDS?: string;
}

const ALLOWED_ACTIONS = new Set(['greet']);

export const onRequestGet: PagesFunction<Env> = async ({ params, request, env }) => {
  const action = String(params.action ?? '');
  if (!ALLOWED_ACTIONS.has(action)) {
    return new Response(`Unknown action: ${action}\nAvailable: ${[...ALLOWED_ACTIONS].join(', ')}\n`, {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
  if (!env.LINK_SIGNING_KEY) {
    return new Response('Server misconfigured: LINK_SIGNING_KEY not set\n', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const url = new URL(request.url);
  const ttl = Math.max(60, Math.min(3600, parseInt(env.LINK_TTL_SECONDS ?? '600', 10)));
  const now = Math.floor(Date.now() / 1000);

  const qp: Record<string, string> = {};
  for (const [k, v] of url.searchParams.entries()) qp[k] = v;

  const payload: Payload = {
    v: 1,
    act: `demo.${action}`,
    params: qp,
    iat: now,
    exp: now + ttl,
    jti: randomJti(),
  };

  const token = await sign(payload, env.LINK_SIGNING_KEY);
  const deepLink = `${url.origin}/act?t=${token}`;

  const body = [
    `# Chips signed deep link`,
    ``,
    `Action: \`${payload.act}\``,
    `Params: ${JSON.stringify(qp)}`,
    `Expires: ${new Date(payload.exp * 1000).toISOString()} (in ${ttl}s)`,
    ``,
    `Click to execute:`,
    ``,
    deepLink,
    ``,
    `(This URL carries an HMAC signature. The server will verify it on click before running the action.)`,
    ``,
  ].join('\n');

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
};
