// Human-facing landing page for signed deep links.
// GET  /act?t=<token>            -> confirm page (does NOT execute; safe for unfurlers)
// POST /act?t=<token>            -> executes the action and renders result
//
// Two-step (GET confirm -> POST execute) because chat clients, Slack, etc. will
// pre-fetch the URL for preview. We must not run side effects on GET.

import { verify } from './_shared/sign';

interface Env {
  LINK_SIGNING_KEY: string;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function page(title: string, inner: string, status = 200): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${esc(title)} — Chips</title>
<style>
  :root { color-scheme: light; }
  body { font: 16px/1.55 ui-serif, "EB Garamond", Georgia, serif; max-width: 36rem; margin: 6rem auto; padding: 0 1.25rem; color: #1a2a1a; background: #f3efe5; }
  h1 { font-weight: 500; letter-spacing: -0.01em; margin: 0 0 1rem; }
  code, pre { font: 13px/1.5 ui-monospace, "JetBrains Mono", Menlo, monospace; background: #e8e2d2; padding: 0.1rem 0.35rem; border-radius: 3px; }
  pre { padding: 0.75rem 1rem; overflow-x: auto; }
  .row { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  button, .btn { font: inherit; padding: 0.55rem 1rem; border-radius: 4px; border: 1px solid #1a2a1a; background: #1a2a1a; color: #f3efe5; cursor: pointer; text-decoration: none; }
  .btn.secondary { background: transparent; color: #1a2a1a; }
  .meta { color: #5a6a5a; font-size: 0.9rem; }
  .err { color: #8a2a2a; }
  .ok { color: #2a5a3a; }
</style>
</head>
<body>${inner}</body>
</html>`;
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('t') ?? '';
  const result = await verify(token, env.LINK_SIGNING_KEY);
  if (!result.ok) {
    return page(
      'Link invalid',
      `<h1>This link can't be used</h1>
       <p class="err">Reason: <code>${esc(result.reason)}</code></p>
       <p class="meta">Ask the assistant for a fresh link.</p>`,
      400,
    );
  }
  const { payload } = result;
  const paramRows = Object.entries(payload.params)
    .map(([k, v]) => `<tr><td><code>${esc(k)}</code></td><td>${esc(String(v))}</td></tr>`)
    .join('');
  return page(
    'Confirm action',
    `<h1>Confirm: <code>${esc(payload.act)}</code></h1>
     <p>An assistant generated this signed link on your behalf. Review and confirm before it runs.</p>
     <table>${paramRows || '<tr><td class="meta">(no parameters)</td></tr>'}</table>
     <p class="meta">Expires ${new Date(payload.exp * 1000).toISOString()}</p>
     <form method="POST" action="/act?t=${encodeURIComponent(token)}">
       <div class="row">
         <button type="submit">Run action</button>
         <a class="btn secondary" href="/">Cancel</a>
       </div>
     </form>`,
  );
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('t') ?? '';
  const result = await verify(token, env.LINK_SIGNING_KEY);
  if (!result.ok) {
    return page('Link invalid', `<h1>Can't run</h1><p class="err">${esc(result.reason)}</p>`, 400);
  }
  const { payload } = result;
  // Demo "execution": just echo. Replace with real action dispatch later.
  // NB: no replay protection yet — add KV-backed jti check before exposing real side effects.
  let resultLine: string;
  switch (payload.act) {
    case 'demo.greet': {
      const name = payload.params.name ?? 'friend';
      resultLine = `Hello, ${name}. Action executed at ${new Date().toISOString()}.`;
      break;
    }
    default:
      resultLine = `(no handler for ${payload.act})`;
  }
  return page(
    'Action executed',
    `<h1 class="ok">✓ Done</h1>
     <p><code>${esc(payload.act)}</code></p>
     <pre>${esc(resultLine)}</pre>
     <p class="meta">jti: <code>${esc(payload.jti)}</code></p>
     <p><a class="btn secondary" href="/">Back</a></p>`,
  );
};
