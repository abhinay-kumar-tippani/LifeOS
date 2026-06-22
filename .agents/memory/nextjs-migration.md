---
name: Next.js 15 App Router migration
description: Patterns and gotchas from migrating LifeOS from Vite+wouter to Next.js 15 App Router
---

# Next.js 15 App Router Migration

## Key mapping
- `import { Link } from "wouter"` → `import Link from "next/link"`
- `import { useLocation } from "wouter"` → `import { useRouter, usePathname } from "next/navigation"`
- `const [, navigate] = useLocation()` → `const router = useRouter()` then `router.push()`
- `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*`

## Env var bridging
`next.config.ts` maps existing Replit VITE_ secrets to NEXT_PUBLIC_ at build time:
```ts
env: {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "",
}
```
This means the user doesn't need to rename secrets.

## "use client" scope
Any file using: useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, useRouter, usePathname, useSearchParams, useParams, framer-motion hooks (useReducedMotion, motion.*), onClick/onChange handlers must have `"use client"` as the first line.

**Why:** Next.js App Router renders all components server-side by default. Client-only APIs (hooks, browser APIs, event handlers) fail on the server unless the component is marked "use client".

**How to apply:** After any migration, run:
```bash
grep -rL '"use client"' src/ --include="*.tsx" | xargs grep -l 'useState\|useEffect\|motion\.\|useReducedMotion'
```
And add "use client" to all matches.

## Common pitfalls
- `src/middleware.ts` with `export {}` — delete it; Next.js picks it up and fails
- Tailwind v4 needs `@tailwindcss/postcss` (not `@tailwindcss/vite`) + `postcss.config.js`
- `typescript: catalog:` fails if not in pnpm-workspace.yaml catalog — use explicit version
- Next.js caches SSR; delete `.next/` if changes don't take effect after file edits
- Layouts with "use client" are fine if they need auth guards or other client hooks
