# Project Progress & Status: BingeAaradhya (MyWatchlist)

## 📌 Project Overview
**BingeAaradhya** is a personal watch-tracking web application ("Letterboxd for Aaradhya"). It allows logging, tracking, rating, and curating movies, TV shows, and anime with TMDB auto-filling capabilities, personal top lists, analytics/statistics, and a simple password-protected admin portal.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Details / Purpose |
|---|---|---|
| **Framework** | Next.js (v16.2 App Router) | Full-stack architecture with React 19 & TypeScript |
| **Styling & UI** | Tailwind CSS v4 + Radix UI / shadcn | Modern clean dark-themed responsive UI with smooth gradients |
| **Database & ORM** | PostgreSQL (Supabase) + Prisma ORM | Relational models for `Entry` and `TmdbCache` |
| **Auth** | JWT / Jose + bcryptjs | Password-gated admin cookie session (`/admin/*` & mutation APIs) |
| **Metadata Integration** | TMDB API (The Movie Database) | Multi-search, movie/tv details, cast & runtime lookup with fallback caching |
| **Drag & Drop** | `@dnd-kit/core` & `@dnd-kit/sortable` | Interactive reordering for Top 10 & Top 5 lists |
| **Data Visualizations**| Recharts | Genre breakdowns, ratings histogram, and watch activity |

---

## 📁 Directory & File Structure

```
BingeAaradhya/
├── app/
│   ├── (public)/                 # Publicly viewable pages (Read-only)
│   │   ├── page.tsx              # Home: Currently watching hero, Top 10, Top 5 lists
│   │   ├── library/page.tsx      # Full watched archive with multi-filter & search
│   │   ├── watchlist/page.tsx    # Future watchlist queue with priority sorting
│   │   └── stats/page.tsx        # Visual analytics dashboard (Charts & stats)
│   ├── admin/                    # Admin portal (Protected)
│   │   ├── login/page.tsx        # Password login screen
│   │   └── entries/page.tsx      # Full CRUD interface with TMDB autofill modal & DND reorder
│   ├── api/                      # REST API Endpoints (Next.js Route Handlers)
│   │   ├── auth/                 # Login, session verification & logout
│   │   ├── entries/              # GET, POST, PUT, DELETE, reorder ranking endpoints
│   │   ├── filters/              # Dynamic list of genres & types in database
│   │   ├── stats/                # Aggregation queries for hours watched, counts, graphs
│   │   └── tmdb/                 # Proxy routes for TMDB search and details fetching
│   ├── layout.tsx                # Root layout with navbar, footer, theme provider
│   └── globals.css               # Design tokens, color system, and layout styling
├── components/
│   ├── AdminEntriesClient.tsx    # Admin dashboard: TMDB search modal, entry editing, status promotions
│   ├── PublicEntriesClient.tsx   # Public library and watchlist grid view
│   ├── EntryCard.tsx             # Responsive card for movies/series with poster, genres, rating
│   ├── FilterBar.tsx             # Genre, type, sort, and query filter controls
│   ├── RankedList.tsx            # Ranked list showcase (Top 10 / Top 5) with drag & drop
│   ├── StatsCharts.tsx           # Charts (Pie, Bar, Area) for watching stats
│   ├── StatsClient.tsx           # Client wrapper for stats data fetching
│   └── ui/                       # Reusable shadcn/Radix primitive components
├── lib/
│   ├── prisma.ts                 # Prisma client singleton instance
│   ├── auth.ts                   # JWT session creation, verification & cookies
│   ├── tmdb.ts                   # TMDB client helper functions & formatting
│   ├── validations.ts            # Zod validation schemas for entry payloads
│   └── utils.ts                  # Classname utilities (cn)
├── prisma/
│   └── schema.prisma             # Database schema (Entry model, EntryStatus, TmdbCache)
├── PRD.md                        # Product Requirements Document
├── TECH_STACK.md                 # Technical stack decisions and documentation
├── DFD.md                        # Data Flow Diagrams
└── progress.md                   # Current implementation status and roadmap
```

---

## 🚦 Progress & Feature Status

### ✅ Completed & Implemented
1. **Database Schema & Prisma Models**:
   - `Entry` model supporting `WATCHLIST`, `WATCHING`, `WATCHED`, `DROPPED` statuses.
   - Fields for custom ratings, synopsis, runtime, cast, custom genres, TMDB IDs, and rank ordering for Top 10 / Top 5.
   - `TmdbCache` model for API response caching.
2. **TMDB Integration**:
   - Multi-search endpoint (`/api/tmdb/search`).
   - Details endpoint (`/api/tmdb/details`) fetching cast, runtime, posters, and overview.
3. **Admin Management & Authentication**:
   - Gated login flow with JWT cookie session.
   - Full CRUD: Add, edit, delete, status promotions (Watchlist → Watching → Watched).
   - Modal with TMDB search auto-fill + fully manual overrides.
4. **Public Interface**:
   - **Home**: Overview of in-progress shows, Top 10, and Top 5 recommendations.
   - **Library**: Filterable & sortable list of completed watches.
   - **Watchlist**: Priority-ordered queue of future watches.
   - **Stats**: Aggregated metrics (total hours, movies vs TV counts, ratings distribution, genre breakdown).
5. **Interactive Reordering**:
   - Drag-and-drop support (`@dnd-kit`) for ranking Top 10 and Top 5 lists.

---

## 📋 Next Steps / Roadmap
- [ ] Connect production Postgres database (Supabase) via `.env`.
- [ ] Run initial migrations (`npx prisma migrate dev` / `npx prisma db push`).
- [ ] Add initial seed data or sample entries to showcase live UI.
- [ ] Polish responsive mobile navigation & smooth transition animations.
- [ ] Optional: Letterboxd / IMDb CSV import tool.
