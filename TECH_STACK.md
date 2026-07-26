# Tech Stack — MyWatchlist

## Summary
A Next.js full-stack app (frontend + API routes in one project), Postgres via Supabase, TMDB for metadata, deployed on Vercel. Chosen to be simple enough for solo/"vibe coded" development while still being a real full-stack app with a proper database.

## Frontend
| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14+ (App Router)** | Single project for frontend + backend (API routes), great defaults, easy Vercel deploy |
| Language | **TypeScript** | Catches bugs early, better autocomplete when vibe-coding with AI assistance |
| Styling | **Tailwind CSS** | Fast to style, no separate CSS files to manage |
| UI Components | **shadcn/ui** | Prebuilt accessible components (cards, dialogs, dropdowns) you own the code for, easy to theme |
| Charts (Stats page) | **Recharts** | Simple React charting for genre breakdown, ratings distribution, watch activity |
| Drag & drop (Top 10/Top 5 reorder) | **@dnd-kit** | Lightweight, accessible drag-and-drop for reordering ranked lists |

## Backend
| Layer | Choice | Why |
|-------|--------|-----|
| API | **Next.js API Routes / Route Handlers** | No separate backend server needed; colocated with frontend |
| ORM | **Prisma** | Type-safe DB access, easy migrations, good with Postgres |
| Validation | **Zod** | Validate form input and API payloads with shared types |

## Database
| Layer | Choice | Why |
|-------|--------|-----|
| Database | **PostgreSQL via Supabase** | Persistent, hosted Postgres with a generous free tier; avoids SQLite's "doesn't persist on serverless" problem |
| Image storage | **Supabase Storage** (or just store TMDB poster URLs directly) | If you want to upload custom posters instead of using TMDB's, Supabase Storage handles it simply |

## External Integration
| Service | Purpose |
|---------|---------|
| **TMDB API** (The Movie Database) | Search-and-autofill for title, poster, synopsis, genre, cast, release year during entry creation |

## Auth
| Layer | Choice | Why |
|-------|--------|-----|
| Admin protection | **Simple password-gated session (env-var password + signed cookie/JWT)**, or NextAuth Credentials provider if you want more structure | This is a single-user site — full multi-user auth (OAuth, social login) is overkill. Public pages stay open; only `/admin/*` routes and mutation API routes are gated |

## Deployment & Hosting
| Layer | Choice | Why |
|-------|--------|-----|
| Hosting | **Vercel** | Native Next.js support, zero-config deploys from GitHub |
| Database hosting | **Supabase** | Managed Postgres, works well with Prisma, free tier is enough for a personal project |
| Env/secrets | Vercel Environment Variables | `DATABASE_URL`, `TMDB_API_KEY`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` |

## Dev Tooling
- **ESLint + Prettier** — consistent code style
- **Prisma Migrate** — versioned DB schema changes
- **GitHub** — version control, connected to Vercel for auto-deploy on push

## Suggested Folder Structure
```
mywatchlist/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Home: currently watching + top 10 + top 5
│   │   ├── library/page.tsx      # Watched library with filters
│   │   ├── watchlist/page.tsx    # Future shows
│   │   └── stats/page.tsx        # Analytics dashboard
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── entries/page.tsx      # Add/edit/reorder UI
│   └── api/
│       ├── entries/route.ts      # CRUD
│       ├── tmdb/search/route.ts  # TMDB proxy
│       ├── stats/route.ts
│       └── auth/route.ts
├── lib/
│   ├── prisma.ts
│   ├── tmdb.ts
│   └── auth.ts
├── prisma/
│   └── schema.prisma
└── components/
    ├── EntryCard.tsx
    ├── FilterBar.tsx
    ├── RankedList.tsx            # Top 10 / Top 5 drag-and-drop
    └── StatsCharts.tsx
```

## Minimal Prisma Schema (starting point)
```prisma
model Entry {
  id          String   @id @default(cuid())
  title       String
  type        String   // "movie" | "tv" | "sitcom" | etc. (free-form/configurable)
  genres      String[] // e.g. ["Comedy", "Drama"]
  status      String   // "watchlist" | "watching" | "watched" | "dropped"
  rating      Float?   // null until watched
  notes       String?
  posterUrl   String?
  tmdbId      Int?
  runtimeMin  Int?     // used for "hours watched" stat
  isTop10     Boolean  @default(false)
  isTop5Rec   Boolean  @default(false)
  rankOrder   Int?     // position within Top 10 / Top 5
  dateAdded   DateTime @default(now())
  dateStarted DateTime?
  dateWatched DateTime?
}
```
