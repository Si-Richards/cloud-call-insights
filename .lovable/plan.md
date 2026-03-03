

## Plan: Add CORS Proxy Edge Function

The browser blocks direct calls to `http://195.206.184.217:8069` because the API server doesn't return `Access-Control-Allow-Origin` headers. The fix is to route all API calls through a server-side proxy (Supabase Edge Function) where CORS restrictions don't apply.

### What We'll Build

**1. Edge Function Proxy (`supabase/functions/api-proxy/index.ts`)**
- Accepts `{ endpoint, method }` in the request body
- Forwards the request to the configured external API URL server-side
- Returns the response with proper CORS headers
- The external API base URL will be passed from the client (since users configure it in Settings)

**2. Update API Client (`src/services/api.ts`)**
- Change `apiFetch` to call the edge function proxy instead of the external API directly
- Send `{ baseUrl, endpoint, method }` to the proxy
- All existing hooks and widgets remain unchanged — only the transport layer changes

### Files

| File | Action |
|---|---|
| `supabase/functions/api-proxy/index.ts` | **Create** — proxy edge function |
| `src/services/api.ts` | **Modify** — route requests through the proxy |

