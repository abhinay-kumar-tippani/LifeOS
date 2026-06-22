# LifeOS

A full-stack productivity dashboard with habits tracking, tasks/Eisenhower matrix, journal, Pomodoro timer, goals, and analytics — powered by Supabase auth and Postgres.

## Run & Operate

- `pnpm --filter @workspace/lifeos run dev` — run the Next.js frontend (port from env)
- `pnpm --filter @workspace/api-server run dev` — run the Express API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + **Next.js 15** App Router + Tailwind v4 + TanStack Query + Zustand
- Auth + DB: Supabase (auth, Postgres, realtime)
- API: Express 5 (file uploads via Cloudinary)
- Build: Next.js (frontend), esbuild (API server CJS bundle)
- UI: shadcn/ui components, lucide-react icons, recharts, dnd-kit

## Where things live

- `artifacts/lifeos/src/` — React/Next.js frontend
  - `app/(auth)/` — login, signup, forgot-password pages (PublicOnlyGuard layout)
  - `app/(dashboard)/` — all dashboard pages (habits, tasks, matrix, goals, journal, pomodoro, analytics, settings)
  - `app/(onboarding)/` — onboarding flow (AuthGuard + OnboardingShell layout)
  - `app/callback/page.tsx` — Supabase auth callback handler
  - `app/page.tsx` — public homepage
  - `app/layout.tsx` — root Next.js layout (Inter font, metadata, Providers)
  - `components/` — all UI components grouped by feature
  - `lib/hooks/` — data-fetching hooks (useHabits, useTasks, useJournal, etc.)
  - `lib/supabase/client.ts` — singleton Supabase browser client
  - `lib/stores/` — Zustand stores (pomodoroStore)
- `artifacts/api-server/src/routes/upload.ts` — Cloudinary file upload endpoint

## Architecture decisions

- **Vite → Next.js 15 App Router migration**: Replaced wouter with `next/navigation`, `import.meta.env.VITE_*` with `process.env.NEXT_PUBLIC_*`, Vite config with `next.config.ts`, added `"use client"` to all interactive components.
- **Route groups**: `(auth)` = PublicOnlyGuard; `(dashboard)` = AuthGuard + DashboardShell; `(onboarding)` = AuthGuard + OnboardingShell.
- **Auth callback**: `/callback` is a client page (`src/app/callback/page.tsx`) that calls `supabase.auth.exchangeCodeForSession(code)` and navigates to `next` param.
- **Env var bridging**: `next.config.ts` maps `VITE_SUPABASE_*` secrets → `NEXT_PUBLIC_SUPABASE_*` at build time, so existing Replit secrets work without renaming.
- **Cloudinary uploads**: Frontend calls `POST /api/upload` on the Express server (auth via Bearer token from Supabase session). Set `NEXT_PUBLIC_API_URL` env var if API server is on a different origin.
- **Onboarding gate**: `OnboardingGate` component in `DashboardLayout` redirects to `/onboarding` when user has no habits and hasn't completed onboarding (checked via `localStorage`).
- **CSS theme**: Tailwind v4 with `@tailwindcss/postcss` plugin. Direct hex/oklch CSS vars in `src/app/globals.css`. Dark mode uses `.dark` class via `next-themes`.

## Product

LifeOS is a productivity operating system with:
- **Habits**: daily habit tracking grid with streaks and heatmaps
- **Tasks**: kanban board + Eisenhower matrix for task prioritization
- **Journal**: rich text journal with Cloudinary image uploads
- **Pomodoro**: focus timer with task linking and session logging
- **Goals**: yearly/monthly/weekly goal hierarchy with progress tracking
- **Analytics**: charts for habit completions, focus time, task velocity
- **Dashboard**: daily overview of all modules at a glance

## Required Secrets

- `VITE_SUPABASE_URL` — Supabase project URL (bridged to NEXT_PUBLIC_ via next.config.ts)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key (bridged to NEXT_PUBLIC_ via next.config.ts)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for file uploads (optional, needed for journal/avatar images)

## Gotchas

- After adding new secrets, restart workflows — Next.js bakes `NEXT_PUBLIC_*` env vars at build/dev start time.
- All interactive components need `"use client"` directive — any file using hooks, browser APIs, or event handlers must be a Client Component.
- `getSupabaseClient()` throws if env vars are missing. All data hooks depend on it — they must render inside client components after the auth context is ready.
- The API server and frontend are separate processes. `NEXT_PUBLIC_API_URL` must be set if they're on different origins in production.
- Do not add `wouter` or `vite` back to the lifeos package — the migration to Next.js is complete.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Original Vite source backed up at `.migration-backup/` (if present)
