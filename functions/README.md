# Pages Functions — signed deep links (test)

Minimal scaffold for testing whether AI chats (ChatGPT, Claude) can mint and
surface signed deep links that drive site actions.

## Routes

- `GET /agent/<action>?<params>` — mints a fresh HMAC-signed URL. Returns plain
  text so chat-model browsing tools can extract the URL from the body.
- `GET /act?t=<token>` — verifies signature + expiry, renders confirm page. No
  side effects (safe for unfurlers).
- `POST /act?t=<token>` — runs the action and shows the result.

## Setup on Cloudflare Pages

1. In the Pages project for chips-site, add an Environment variable
   `LINK_SIGNING_KEY` (mark as secret) for both Production and Preview. Generate one:
   ```bash
   openssl rand -base64 32
   ```
2. (Optional) `LINK_TTL_SECONDS` — default `600` (10 min).
3. Deploy the branch as a Preview, then test.

## End-to-end test

1. Confirm robots: `curl https://<preview>.pages.dev/robots.txt`
2. Mint: `curl https://<preview>.pages.dev/agent/greet?name=Azim`
   - Body should contain a `https://.../act?t=...` URL.
3. Open the URL in a browser → confirm page → click "Run action" → success page.
4. From ChatGPT (browsing enabled) or Claude (web tool), prompt:
   > Fetch `https://<preview>.pages.dev/agent/greet?name=Azim` and give me the signed link from the response.
   The assistant should reply with the clickable URL. Click it → confirm → run.

## What's intentionally missing (don't ship beyond demo)

- **Replay protection.** Add a KV namespace + jti check in `functions/act.ts`
  before exposing any real side effect.
- **Mint-side auth.** Right now anyone can mint a link for any allowed action.
  Fine for `demo.greet`; not fine for real actions. Gate `/agent/*` behind a
  bearer token or Cloudflare Access before adding sensitive actions.
- **User auth.** The confirm page currently doesn't require login. Real actions
  must bounce through auth before POST.
- **Action whitelist beyond `greet`** — add to `ALLOWED_ACTIONS` in
  `functions/agent/[action].ts` and a case in `functions/act.ts`.
