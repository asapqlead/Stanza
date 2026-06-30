# Stanza

**Daily Planner PWA — Your day, in folders.**

Stanza reimagines daily task management through a tactile folder metaphor. Each day is a physical folder containing stacked task cards you swipe, tap, and complete with satisfying spring animations — all synced in real time.

![Platform](https://img.shields.io/badge/platform-PWA-1C1C1E?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Supabase-F5C842?style=flat-square)

---

## Features

- **Folder-style task stacking** — pending tasks stack like physical folder tabs; tap to expand into a scrollable list
- **Swipe navigation** between day folders (swipe left = next day, right = previous)
- **Real-time sync** via Supabase Postgres + Realtime — changes appear instantly across devices
- **Priority-coded task cards** — Low / Medium / High / Blocked, color-coded and clearly labeled
- **Calendar overview** — year, month, and day views with task-status dot indicators
- **Drag-to-reorder**, task completion animation, and haptic feedback
- **Auth** — email/password and Magic Link via Supabase Auth
- **Installable PWA** — offline app shell, Add to Home Screen on iOS/Android
- **Dark-mode-first design system** with full accessibility support (AA/AAA contrast, VoiceOver labels, reduced-motion support)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Animations | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Dates | date-fns |
| Backend | Supabase (Auth, Postgres, Storage, Realtime) |
| Hosting | Vercel (CDN + Edge) |
| PWA | vite-plugin-pwa + Workbox |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project
- A free [Vercel](https://vercel.com) account (for deployment)

### 1. Clone & install

```bash
git clone https://github.com/your-org/stanza.git
cd stanza
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Grab your **Project URL** and **anon key** from Settings → API
3. Run the schema migration:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates the `tasks`, `profiles`, `task_assignees`, and `attachments` tables with Row Level Security policies already configured.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Generate TypeScript types (optional, recommended)

```bash
npm run gen:types
```

### 5. Run the dev server

```bash
npm run dev
```

Open `http://localhost:5173`. To test on a phone, visit `http://<your-local-ip>:5173` while on the same Wi-Fi network.

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel --prod
```

Then add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel dashboard under **Project → Settings → Environment Variables** (for Production, Preview, and Development).

Every pull request automatically gets its own preview deployment.

---

## Project Structure

```
stanza/
├── public/icons/              # PWA icons (192, 512, maskable)
├── src/
│   ├── components/
│   │   ├── TaskCard/          # Task card + stacked tab variant
│   │   ├── DayFolder/         # Folder view, swipe, expand/collapse
│   │   ├── NavBar/            # Floating animated nav bar
│   │   ├── AddTaskSheet/      # Bottom sheet task creation form
│   │   ├── CalendarView/      # Month grid + task status dots
│   │   ├── TopBar/            # Avatar, date header, add button
│   │   └── common/            # Shared UI (SplashScreen, etc.)
│   ├── hooks/                 # useAuth, useTasks, useSwipe, useHaptic
│   ├── lib/supabase.ts        # Supabase client singleton
│   ├── pages/                 # Auth, Home, Calendar, Settings
│   ├── store/useAppStore.ts   # Zustand UI state
│   ├── styles/                # Design tokens + global CSS
│   ├── types/                 # Shared TypeScript types
│   └── utils/                 # Date, sort, and task mutation helpers
├── supabase/
│   ├── migrations/            # SQL schema + RLS policies
│   └── seed.sql               # Sample dev data
└── vercel.json                # Rewrites + security headers
```

---

## Data Model

| Table | Purpose |
|---|---|
| `profiles` | Extended user data (display name, avatar) |
| `tasks` | Core task records — title, urgency, due date/time, sort order |
| `task_assignees` | Join table for assigning tasks to other users |
| `attachments` | File metadata referencing Supabase Storage objects |

All tables are protected by Postgres Row Level Security — users can only ever read or write their own data.

---

## Design System

Stanza uses a dark-mode-first design language with a near-black base (`#1C1C1E`) and a warm yellow accent (`#F5C842`). Task priority is color-coded:

| Priority | Color |
|---|---|
| Low | Sage Green `#C8E6A0` |
| Medium | Warm Amber `#F5E6A0` |
| High | Soft Red `#F5A0A0` |
| Blocked | Lavender `#E8C0F0` |

Full tokens (spacing, radius, typography) live in `src/styles/tokens.css`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests with Vitest |
| `npm run gen:types` | Regenerate TypeScript types from Supabase schema |
| `npm run db:push` | Push local migrations to linked Supabase project |

---

## Roadmap

- [ ] Push notifications (Supabase Edge Functions + Web Push)
- [ ] Recurring tasks
- [ ] Shared/collaborative task folders
- [ ] Third-party calendar sync (Google Calendar, Outlook)

---

## License

MIT
