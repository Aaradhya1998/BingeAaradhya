# BingeAaradhya

A personal full-stack watch tracker for logging, ranking, and showcasing movies and shows. The app combines a public-facing media shelf with a lightweight admin panel, so Aaradhya can manage entries privately while sharing curated lists and stats publicly.

## Highlights

- Public homepage with:
  - currently watching
  - Top 10 all-time picks
  - Top 5 recommendations
- Watched library with filtering, sorting, and search
- Watchlist view for upcoming picks
- Stats dashboard with:
  - totals
  - genre breakdown
  - ratings distribution
  - monthly activity
  - estimated hours watched
- Admin-protected entry management
- TMDB-powered search and metadata autofill
- Manual overrides for every imported field
- Drag-and-drop style ranked list reordering for Top 10 and Top 5

## Tech Stack

- `Next.js` App Router
- `React` + `TypeScript`
- `Prisma` with PostgreSQL
- `Tailwind CSS`
- `shadcn/ui`
- `Recharts`
- `Zod`
- `TMDB API`
- Cookie-based admin session using signed JWTs

## Project Structure

```text
app/
  (public)/
    page.tsx              # Home
    library/page.tsx      # Watched library
    watchlist/page.tsx    # Watchlist
    stats/page.tsx        # Analytics
  admin/
    login/page.tsx
    entries/page.tsx      # Admin dashboard
  api/
    auth/route.ts
    entries/route.ts
    filters/route.ts
    stats/route.ts
    tmdb/search/route.ts
components/               # UI and client components
lib/                      # Auth, Prisma, TMDB, validation helpers
prisma/
  schema.prisma
```

## Features

### Public experience

- Browse everything currently being watched
- Explore a filterable watched archive
- Check what is queued in the watchlist
- View ranked favorites and recommendations
- See analytics built from tracked entries

### Admin experience

- Password-protected login
- Create, edit, and delete entries
- Move titles between `WATCHLIST`, `WATCHING`, `WATCHED`, and `DROPPED`
- Add ratings, notes, genres, progress, runtime, and ranking flags
- Reorder Top 10 and Top 5 lists
- Use TMDB search to prefill title, poster, synopsis, cast, genres, release year, runtime, seasons, and episodes

## Data Model

Each entry can store:

- title and type
- genres and status
- rating and notes
- synopsis and cast
- poster and backdrop URLs
- TMDB metadata
- runtime and consumed units for watch-time estimation
- progress text
- optional Top 10 / Top 5 ranking
- started and watched dates

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="postgresql://..."
TMDB_API_KEY="your_tmdb_key"
ADMIN_PASSWORD_HASH="your_bcrypt_hash"
SESSION_SECRET="a_long_random_secret"
```

### Notes

- `DATABASE_URL` should point to your PostgreSQL database.
- `TMDB_API_KEY` is used by `/api/tmdb/search`.
- `ADMIN_PASSWORD_HASH` must be a bcrypt hash, not a plain-text password.
- `SESSION_SECRET` is used to sign the admin session JWT.

To generate a bcrypt password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Add the required values to `.env`.

### 3. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 4. Generate the Prisma client

```bash
npm run prisma:generate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - start the local development server
- `npm run build` - build the production app
- `npm run start` - start the production server
- `npm run lint` - run ESLint
- `npm run prisma:generate` - generate the Prisma client

## Main Routes

### Public

- `/` - homepage
- `/library` - watched archive
- `/watchlist` - future watchlist
- `/stats` - analytics dashboard

### Admin

- `/admin/login` - admin sign-in
- `/admin/entries` - create and manage entries

## API Overview

- `GET /api/auth` - check admin session
- `POST /api/auth` - log in
- `DELETE /api/auth` - log out
- `GET /api/entries` - fetch entries with filters
- `POST /api/entries` - create an entry
- `PUT /api/entries` - update an entry
- `PATCH /api/entries` - reorder ranked lists
- `DELETE /api/entries` - delete an entry
- `GET /api/filters` - fetch available filters
- `GET /api/stats` - fetch analytics data
- `GET /api/tmdb/search?q=...` - search TMDB metadata

## Deployment

This app is a good fit for:

- `Vercel` for the Next.js app
- `Supabase` or any hosted PostgreSQL provider for the database

Before deploying, make sure production values are set for all environment variables and Prisma migrations have been applied.

## Future Improvements

- Import from Letterboxd, IMDb, or Trakt
- Richer episode-level tracking
- Better media assets and social preview cards
- Automated monthly recap or digest features

## License

This project is currently private/personal unless a license is added.
