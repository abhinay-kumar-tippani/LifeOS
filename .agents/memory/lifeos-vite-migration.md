---
name: LifeOS Vite migration patterns
description: Non-obvious decisions and sharp edges from migrating Next.js LifeOS to Replit pnpm-workspace/Vite
---

## Auth callback
In Vite, Supabase auth callback cannot be a server route. It must be a React page at `/callback` that calls `supabase.auth.exchangeCodeForSession(code)` from URL params, then navigates to `next` param.

**Why:** No server-side route handlers exist in the Vite artifact.

## next package must stay removed
The `next` package was a leftover dependency — importing it caused React duplication ("Invalid hook call") because Next.js bundles its own React. It's been removed from `artifacts/lifeos/package.json`.

**Why:** Even if no code imports from `next`, the package being installed can confuse module resolution.

## Supabase client must guard missing env vars
`getSupabaseClient()` throws explicitly if `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are not set, rather than passing undefined to `createBrowserClient` (which throws a generic error inside the library with a confusing stack trace).

## CSS theme: direct hex/oklch, not HSL
The original theme used `hsl(var(--background))` pattern but this project uses direct hex/oklch values in CSS vars (e.g. `--background: #0a0a0f`). The `@theme inline` block maps them via `var()`. Do NOT use `hsl()` wrappers.

**How to apply:** When adding new theme colors, write `--my-color: #hex` in `:root`/`.dark`, then `--color-my-color: var(--my-color)` in `@theme inline`.

## Cloudinary uploads go through Express API server
The `/api/upload` endpoint lives in `artifacts/api-server/src/routes/upload.ts`. The client (`src/lib/cloudinary/upload.ts`) reads `VITE_API_URL` env var as a base URL prefix (empty string = same origin). Set it in production if frontend and API are on different domains.
