# LifeOS

A full-stack productivity dashboard with habits tracking, tasks/Eisenhower matrix, journal, Pomodoro timer, goals, and analytics — powered by Supabase auth and Postgres.

## Run & Operate

- `pnpm --filter @workspace/lifeos run dev` — run the React/Vite frontend (port from env)
- `pnpm --filter @workspace/api-server run dev` — run the Express API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind v4 + wouter (routing) + TanStack Query + Zustand
- Auth + DB: Supabase (auth, Postgres, realtime)
- API: Express 5 (file uploads via Cloudinary)
- Build: esbuild (API server CJS bundle)
- UI: shadcn/ui components, lucide-react icons, recharts, dnd-kit

## Where things live

- `artifacts/lifeos/src/` — React frontend
  - `app/(auth)/` — login, signup, forgot-password page components
  - `app/(dashboard)/` — all dashboard pages (habits, tasks, matrix, goals, journal, pomodoro, analytics, settings, onboarding)
  - `app/page.tsx` — public homepage
  - `components/` — all UI components grouped by feature
  - `lib/hooks/` — data-fetching hooks (useHabits, useTasks, useJournal, etc.)
  - `lib/supabase/client.ts` — singleton Supabase browser client
  - `lib/stores/` — Zustand stores (pomodoroStore)
- `artifacts/api-server/src/routes/upload.ts` — Cloudinary file upload endpoint
- `artifacts/lifeos/src/App.tsx` — wouter router, maps all routes

## Architecture decisions

- **Next.js → Vite migration**: Replaced `next/navigation` with wouter, `next/image` with `<img>`, `next/dynamic` with direct imports. Deleted all Next.js server-side files (middleware, server.ts, route handlers).
- **Auth callback**: `/callback` is a React page component (`src/pages/auth/CallbackPage.tsx`) that calls `supabase.auth.exchangeCodeForSession(code)` and navigates to `next` param.
- **Cloudinary uploads**: Frontend calls `POST /api/upload` on the Express server (auth via Bearer token from Supabase session). Set `VITE_API_URL` env var if API server is on a different origin.
- **Onboarding gate**: `useOnboardingGate` in `DashboardLayout` redirects to `/onboarding` when user has no habits and hasn't completed onboarding (checked via `localStorage`).
- **CSS theme**: Tailwind v4 with direct hex/oklch CSS vars in `src/index.css` (not HSL). Dark mode uses `.dark` class via `next-themes`.

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

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for file uploads (optional, needed for journal/avatar images)

## Gotchas

- After adding new secrets, restart workflows — Vite bakes env vars at build/dev start time.
- The `next` package has been removed; do not re-add it. It causes React duplication errors.
- `getSupabaseClient()` throws if called before env vars are set. All data hooks depend on it — they must be inside components that are rendered only after the auth context is ready.
- The API server and frontend are separate processes. `VITE_API_URL` must be set if they're on different origins in production.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Original Next.js source backed up at `.migration-backup/`
