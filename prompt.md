# MASTER PROMPT — LifeOS: Free SaaS-Level Product Upgrade (Target 10/10)

You are a senior SaaS product engineer, UI/UX designer, and frontend architect.

Your job is to transform **LifeOS** from a strong beta MVP into a **production-grade, free SaaS product** that feels as polished as Linear, Notion, or Raycast — WITHOUT adding paid billing or subscriptions. The product stays **100% free forever**.

---

## PROJECT CONTEXT

**Product:** LifeOS — a personal productivity operating system  
**Live URL:** https://abhinay-kumar-life-os.vercel.app/  
**Repo:** LifeOS (Next.js 15 App Router monorepo in `src/`)

**Tech stack (DO NOT replace):**
- Next.js 15 App Router, React 18, TypeScript
- Supabase (auth + Postgres)
- TanStack React Query, Zustand (Pomodoro)
- Tailwind CSS v4 (`src/app/globals.css` → `src/styles/theme.css`)
- shadcn/ui + Radix UI
- Recharts, dnd-kit, Framer Motion, Sonner toasts, Cloudinary uploads

**Design direction:**
- Premium dark-first aesthetic (charcoal `#0a0a0f`, indigo primary `#6366f1`)
- Calm, minimal, high-trust productivity SaaS — NOT gamer/cyberpunk
- One cohesive product, not disconnected pages

---

## WHAT IS ALREADY DONE (DO NOT REGRESS)

These were recently implemented — preserve and build on them:

1. **Analytics honesty:** No fake metrics. Real MoM comparison, real weekly rates, real trend logic, `calculateBestStreak()`, FocusTimeChart wired up
2. **Legal:** `/privacy`, `/terms` pages; footer links fixed
3. **Auth:** Forgot password at `/forgot-password`; `/goals` in middleware protected routes
4. **Design tokens:** Analytics/Goals partially migrated to semantic tokens; shared `StatCard` on analytics KPIs
5. **Habits:** Uses `habit.color` from DB (not name-hash); archive confirm dialog; clearer copy
6. **Settings:** Styled avatar upload; Cloudinary config hidden from users; delete uses ConfirmDialog
7. **Empty states:** Dashboard, Kanban columns, Matrix quadrants have CTAs
8. **Preferences wired:** Pomodoro default from localStorage; archived habits toggle invalidates analytics

---

## YOUR MISSION

Make LifeOS feel like a **real free SaaS product** that strangers would trust and use daily.

**Target scores (self-assess before finishing):**
| Area | Current ~ | Target |
|------|-----------|--------|
| UI visual polish | 7/10 | 10/10 |
| UX usability | 6/10 | 10/10 |
| Production readiness | 6/10 | 10/10 |
| Trust & professionalism | 6/10 | 10/10 |
| Feature completeness | 7/10 | 9/10 |

**Hard constraints:**
- NO Stripe, NO pricing tiers, NO paywalls — free forever
- NO fake data, NO placeholder metrics, NO misleading labels
- Minimize scope creep — polish what exists before adding new modules
- Match existing code conventions (read surrounding files before editing)
- Do NOT break Supabase auth or existing data models unless migration is included
- Run `npm run build` and fix all TypeScript/lint errors before finishing
- Do NOT edit any `.plan.md` audit files

---

## REPO MAP (KEY PATHS)
src/app/ page.tsx # Landing page privacy/page.tsx, terms/page.tsx (auth)/login, signup, forgot-password, callback (dashboard)/ layout.tsx # AuthGuard + PomodoroEngine + DashboardShell dashboard, habits, journal, goals, pomodoro, tasks, matrix, analytics, settings loading.tsx

src/components/ layout/ Sidebar, TopBar, MobileNav, DashboardShell shared/ PageHeader, StatCard, EmptyState, ErrorState, ConfirmDialog, LoadingSpinner habits/ HabitGrid, HabitCard, HabitForm tasks/ KanbanBoard, KanbanColumn, KanbanCard, TaskForm matrix/ EisenhowerGrid, MatrixQuadrant, MatrixTaskCard analytics/ Charts + InsightsTable + WeeklyHeatmap homepage/ Navbar, HeroSection, FeatureSection, Footer, etc. settings/ AvatarUpload

src/lib/ hooks/ useHabits, useTasks, useAnalytics, useUser, useGoals, useJournal, usePomodoro supabase/ client, server, middleware stores/ pomodoroStore, PomodoroEngine utils/ streaks, productivity, pomodoroPrefs, analyticsHelpers

src/styles/theme.css # Design tokens — single source of truth src/middleware.ts # Route protection


**Dead code to remove if safe:** `@mui/material`, `@mui/icons-material`, `react-slick`, `embla-carousel-react` (zero imports in src), unused shadcn `ui/sidebar.tsx`, unused habit components (`HabitStreakBadge`, `HabitHeatmap`, `HabitCheckbox`), unused analytics components if any.

---

## PHASE 1 — PRODUCTION HARDENING (CRITICAL)

### 1.1 Global error handling
Create:
- `src/app/error.tsx` — root error boundary with retry + home link
- `src/app/not-found.tsx` — branded 404
- `src/app/(dashboard)/error.tsx` — dashboard error boundary
- `src/app/(dashboard)/not-found.tsx` — optional

Every dashboard page should surface hook errors via `ErrorState`, not silent failures. Audit: Dashboard, Goals, Pomodoro, Matrix still weak.

### 1.2 Progressive loading
**Problem:** Dashboard blocks on 6 hooks before showing anything.

**Fix:** Replace full-page spinner with per-section skeletons. Show greeting + skeleton cards immediately; hydrate sections as data arrives. Use existing `Skeleton` from shadcn.

Apply same pattern to Analytics (charts can skeleton individually).

### 1.3 Auth completeness
- After password reset email, user lands on `/settings` — show toast/banner: "Set your new password below"
- Signup success flow polish
- OAuth callback: handle exchange errors gracefully (don't silent redirect on failure)
- Add resend confirmation email option on signup waiting screen if applicable

### 1.4 Data export (trust signal for free SaaS)
Add to Settings → new "Your data" card:
- Export all user data as JSON download (habits, completions, tasks, journal, goals, pomodoro sessions)
- Button: "Download my data"
- Required for GDPR-style trust even on free product

---

## PHASE 2 — DESIGN SYSTEM UNIFICATION (10/10 UI)

**Goal:** Every page must look like ONE product built by ONE team.

### 2.1 Token enforcement
Audit ALL pages for hardcoded colors like:
- `bg-[#111118]`, `text-white`, `text-gray-400`, `bg-[#0a0a0f]`

Replace with semantic tokens from `theme.css`:
- `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`

**Pages to audit:** Goals cards, MainGoalCard, MonthlyGoalCard, journal pages, matrix quadrants, landing page sections, auth pages.

### 2.2 Component consistency
| Element | Standard |
|---------|----------|
| Page title | `PageHeader` with h1 — TopBar shows muted breadcrumb-style title only (already `<p>`, keep it) |
| KPI cards | Always `StatCard` — never custom card markup |
| Empty states | Always `EmptyState` with CTA (href or onClick) |
| Destructive actions | Always `ConfirmDialog` |
| Primary buttons | shadcn `Button` default variant |
| Cards | `Card` with `border-border/60 bg-card/40` |

### 2.3 Typography & spacing scale
Define and apply consistently:
- Page: `space-y-8` or `space-y-10`
- Section headings: `text-lg font-semibold`
- Body: `text-sm text-muted-foreground`
- Stat numbers: `text-2xl font-bold` (StatCard standard — don't mix text-4xl unless hero)

### 2.4 Light mode audit
Theme toggle exists in Settings. **Every page must work in light mode.**
- Remove forced `dark` class hacks where possible
- Test: landing, dashboard, habits, analytics, settings in light mode
- Fix contrast issues (WCAG AA minimum)

### 2.5 Micro-interactions (premium feel)
- Habit completion: subtle confetti or check animation (`canvas-confetti` already in package.json)
- Task drag: smooth dnd-kit transitions
- Button press: existing shadcn states sufficient
- Page transitions: optional subtle fade via Framer Motion on dashboard route changes (don't overdo)
- Toast feedback on ALL mutations (create, update, delete, archive)

---

## PHASE 3 — UX EXCELLENCE (10/10 UX)

### 3.1 Onboarding (MUST HAVE for SaaS feel)
Create first-run experience at `/onboarding` or modal on first dashboard visit:

**Step 1:** Welcome — "Let's set up your LifeOS"  
**Step 2:** Pick 3 starter habits (suggested templates: Wake early, Exercise, Read, Deep focus, etc.) — one-click add  
**Step 3:** Optional — set main goal  
**Step 4:** Tour highlights — Dashboard, Habits grid, Pomodoro, Tasks (3-4 tooltips or spotlight steps)

Store completion in `profiles.onboarding_completed` (add Supabase migration if column missing, or localStorage fallback).

**Do not block** returning users. Skip button always visible.

### 3.2 Command palette (Cmd+K)
`cmdk` is already installed. Build `CommandPalette` in dashboard layout:

Actions:
- Navigate to any page
- Quick add: habit, task, journal entry
- Start Pomodoro
- Search habits/tasks/journal by name

Trigger: Cmd+K / Ctrl+K + sidebar hint button.

### 3.3 Task editing (critical gap)
Tasks can be created but NOT edited.

Add:
- Click Kanban card → slide-over sheet or dialog with full edit (title, description, priority, due date, status)
- Same task data used by Matrix
- Delete with ConfirmDialog (visible button, not hover-only)

### 3.4 Hover-only actions fix
**Problem:** KanbanCard, MatrixTaskCard, JournalCard hide delete/edit until hover — broken on mobile/touch.

**Fix:** Always-visible `⋯` menu (DropdownMenu) with Edit, Delete, Mark done.

### 3.5 Keyboard accessibility for DnD
Add `KeyboardSensor` from dnd-kit to KanbanBoard and EisenhowerGrid, OR provide non-drag alternative (move task via dropdown "Move to…").

### 3.6 Habit UX improvements
- **Mobile list view:** Below `md` breakpoint, show simple daily checklist instead of horizontal-scroll grid (toggle or auto)
- **Mark today feedback:** toast + optional confetti on completion
- **Clarify grid rules:** persistent info banner on first visit: "Only today is editable. Past days are your history."
- **Remove or implement** unused HabitForm fields: `icon`, `target_days`, `frequency: weekly` — either wire logic or remove from form

### 3.7 Dashboard as true command center
Add widgets:
- **Goals snippet** — main goal + this week's focus (link to /goals)
- **Weekly activity mini-chart** — 7-day habit completion sparkline
- **Quick add bar** — single input: "Add a task…" creates todo

Remove duplicate date (TopBar already shows datetime).

Add productivity score tooltip explaining formula (habits 40%, pomodoro 30%, journal 20%, tasks 10%).

### 3.8 Search
- Journal list: search by title/content/tags
- Tasks: filter by priority, status
- Global search via command palette

---

## PHASE 4 — PAGE-BY-PAGE POLISH

### Landing page (`src/app/page.tsx` + homepage components)
**Target:** Convert visitors like a top indie SaaS.

Add:
- "Free forever" badge near hero CTA (no pricing page needed — just trust)
- Real app screenshots (not only mock preview) — use actual dashboard screenshots or build a static showcase component
- FAQ section (5-6 questions: data privacy, account delete, free forever, what makes LifeOS different)
- Social proof placeholder section (GitHub stars count via API optional, or "Built for people who take their day seriously")
- Fix duplicate `#about` id if still present
- SEO: unique metadata per section via layout or generateMetadata

Keep: existing hero, feature grid, dark gradient aesthetic.

### Dashboard
- Skeleton loading per section
- Goals widget
- Better empty states (already started — refine sizing inside cards)
- Remove emoji from greeting OR keep but make optional in settings

### Habits
- Mobile list view
- Grid legend uses semantic tokens (partially done)
- Reduce visual redundancy: grid OR cards as primary — cards could collapse to "Summary" accordion on mobile

### Analytics
- Date range picker: 7d / 30d / 90d (update useAnalytics query params)
- Actionable insight sentence at top: e.g. "You completed 12 habits this week, up 20% from last week"
- Export chart data as CSV button
- Ensure ALL charts show empty state message, never `return null` silently

### Journal
- Mood/tag chips visible in list cards
- Relative dates ("Today", "Yesterday")
- Search/filter bar
- Pagination or "Load more" after 20 entries

### Pomodoro
- `aria-live="polite"` region announcing time remaining every minute and on session complete
- Keyboard: Space = start/pause
- Show weekly focus summary below timer
- Break vs focus visual distinction (green ring for break, indigo for focus)

### Tasks + Matrix
- Task edit sheet
- Empty states done — add illustration or icon
- Matrix: task count badge per quadrant; example hints under quadrant titles

### Goals
- Progress bars on monthly/weekly goals (% complete checkbox)
- Link "Add task for this goal" (optional stretch — requires goal_id on tasks)

### Settings
- Sync preferences to Supabase `profiles` table (pomodoro default, show archived) — not just localStorage
- Notification preferences section (browser notifications for pomodoro end — optional, request permission)
- Session info: "Member since {date}"

### Sidebar
- Consider grouping nav items with subtle section labels:
  - **Home:** Dashboard
  - **Plan:** Tasks, Matrix, Goals
  - **Track:** Habits, Journal, Analytics
  - **Focus:** Pomodoro
  - **Account:** Settings
- Badge on Habits nav: incomplete today count (e.g. "3/10")
- Cmd+K hint at bottom when expanded: "⌘K quick actions"

---

## PHASE 5 — ACCESSIBILITY (REQUIRED FOR 10/10)

- Skip to content link (first focusable element in layout)
- One h1 per page (PageHeader OR dashboard greeting — never both as h1; dashboard greeting stays h1, other pages use PageHeader)
- All icon-only buttons: `aria-label`
- Pomodoro timer: `aria-live` region
- Form fields: `htmlFor` on all labels
- Focus visible rings (shadcn default — verify not overridden)
- `prefers-reduced-motion`: disable Framer Motion on landing when set
- Color contrast WCAG AA in both themes
- Images: meaningful `alt` text (avatars can use name)

---

## PHASE 6 — PERFORMANCE

- `next/dynamic` lazy-load Recharts on Analytics page (heavy bundle)
- Lazy-load Kanban/Matrix dnd-kit chunks if beneficial
- Remove unused deps: MUI, react-slick, embla-carousel
- PomodoroEngine: already runs globally — acceptable
- Add `loading.tsx` per heavy route if missing (analytics, habits)
- Verify Cloudinary images use lazy loading (CloudinaryImage component)

---

## PHASE 7 — LANDING + TRUST (FREE SAAS)

Since there's no billing, trust comes from:

1. **Privacy/Terms** — already exist, link prominently in footer + signup
2. **"Free forever"** messaging on landing + signup
3. **Data export** in settings
4. **Account deletion** — already exists, verify it works end-to-end
5. **Contact email** — hello@lifeos.app in footer (already there)
6. **Open source / GitHub link** — already in footer
7. **No fake stats** anywhere in the app

Add signup checkbox: "I agree to Terms and Privacy Policy" (required).

---

## IMPLEMENTATION ORDER (FOLLOW THIS)

**Sprint 1 — Trust & stability (do first)**
1. error.tsx + not-found.tsx
2. Dashboard skeleton loading
3. Task edit sheet
4. Hover-only → dropdown menus
5. Data export in settings

**Sprint 2 — SaaS UX**
6. Onboarding flow
7. Command palette (Cmd+K)
8. Mobile habit list view
9. Dashboard goals widget + quick add

**Sprint 3 — Visual polish**
10. Design token audit all pages
11. Light mode pass
12. Landing FAQ + free forever + screenshots
13. Micro-interactions (confetti, toasts everywhere)

**Sprint 4 — Excellence**
14. Analytics date range + insight sentence
15. Journal search
16. Accessibility pass
17. Performance (dynamic imports, remove dead deps)
18. Final `npm run build` + manual QA checklist

---

## QA CHECKLIST (RUN BEFORE DECLARING DONE)

- [ ] `npm run build` passes with zero errors
- [ ] Login, signup, Google OAuth, forgot password, logout all work
- [ ] Every protected route redirects unauthenticated users to login
- [ ] Create/edit/delete: habit, task, journal entry, goal
- [ ] Kanban drag + Matrix drag work; keyboard alternative exists
- [ ] Pomodoro completes session, logs to history, sidebar badge works
- [ ] Analytics numbers match actual user actions (no fake data)
- [ ] Light mode readable on all pages
- [ ] Mobile: sidebar sheet nav, habit list view, no broken layouts
- [ ] Settings: avatar upload, password change, data export, delete account
- [ ] Landing: privacy/terms links work, FAQ present, free forever clear
- [ ] Lighthouse: aim for 90+ accessibility, 90+ best practices on dashboard

---

## CODE QUALITY RULES

- Minimal diffs — don't rewrite working files unnecessarily
- Reuse existing shared components (`PageHeader`, `StatCard`, `EmptyState`, `ConfirmDialog`)
- React Query for all server data; invalidate correct keys on mutations
- Zod + react-hook-form for all forms
- No `console.log` in production paths
- No hardcoded user-facing fake metrics
- Comments only for non-obvious business logic
- Match existing import style (`@/` alias)

---

## DEFINITION OF DONE

LifeOS is "10/10 free SaaS" when:

1. A stranger can sign up, complete onboarding, and understand the product in under 3 minutes
2. Every screen looks like it belongs to the same design system in light AND dark mode
3. No feature advertises behavior it doesn't deliver
4. Tasks are fully editable; habits work on mobile; analytics provides actionable insight
5. Errors fail gracefully with branded UI, not white screens
6. The landing page builds trust for a free product (privacy, export, delete, FAQ, free forever)
7. Cmd+K exists and makes power users feel at home
8. Build passes; no dead dependencies; no accessibility blockers on core flows

Start by reading the codebase structure, then execute Sprint 1 completely before moving to Sprint 2. Commit logically grouped changes. Do not ask clarifying questions — make sensible product decisions and document them in a brief CHANGELOG.md at the end.

---

## REFERENCE: CURRENT SCORES (DO NOT REGRESS)

Before your work (~after first audit fixes):
- UI: 7/10
- UX: 6/10
- Production readiness: 6/10
- Overall: strong beta MVP

After your work:
- Target ALL categories: 9-10/10
