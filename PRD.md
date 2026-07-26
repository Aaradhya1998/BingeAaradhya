# PRD — MyWatchlist (Personal Watch Tracker)

## 1. Overview
A personal website to track and showcase everything I watch — movies, TV series, and shows — with my own ratings, curated top picks, and a running watchlist. Single-user, personal-brand style site (think "letterboxd, but just for me, and mine").

## 2. Goals
- Give me one place to log what I'm watching, have watched, and plan to watch.
- Showcase curated picks (Top 10, Top 5 recommendations) publicly, like a portfolio page.
- Make it fast to add/update entries (manual entry, with TMDB auto-fill to avoid retyping metadata).
- Let visitors (or future me) filter and browse by category/genre/type.
- Surface light analytics about my own watching habits.

## 3. Non-Goals
- Not a multi-user social platform (no other accounts, no following/friends).
- Not a full review-writing platform — ratings + short notes only, not long-form reviews.
- No streaming/playback — this only tracks, it doesn't stream content.

## 4. User
Single user (site owner/admin) with an admin view for adding/editing entries, and a public-facing view for anyone visiting the site.

## 5. Core Features

### 5.1 Currently Watching
- A rail/section showing what's in progress right now.
- Fields: title, poster, type (movie/TV/sitcom/show), progress (e.g. "S2E4"), date started.

### 5.2 Watched Library
- Full archive of everything completed.
- Fields: title, poster, type, genre, my rating (e.g. /10 or /5 stars), date watched, short note/thoughts.
- Sortable by date watched, rating, title, genre.

### 5.3 Future Shows (Watchlist)
- Things I plan to watch next.
- Fields: title, poster, type, genre, priority/order, date added.
- Option to promote an item from Watchlist → Currently Watching → Watched with one action.

### 5.4 Top 5 Recommendations
- A hand-picked, manually-ordered list of 5 things I'd recommend to others.
- Distinct from "Top 10" — this is "what I'd tell a friend to watch," not necessarily my highest-rated.

### 5.5 My Top 10
- My all-time top 10, ranked, editable/reorderable at any time.
- Meant to be the "hero" showcase section of the site.

### 5.6 Filters
- Filter library/watchlist by category: Sitcom, TV Drama, Movie, Documentary, Anime, etc. (configurable list, not hardcoded).
- Combinable with sort (rating, date, alphabetical).

### 5.7 Manual Entry + TMDB Auto-fill
- Add New Entry form: search TMDB by title → auto-fills poster, synopsis, genre, release year, cast.
- All fields remain manually editable/overridable after auto-fill (in case of TMDB gaps or personal categorization, e.g. "Sitcom" isn't a native TMDB genre).
- Fully manual entry also supported for anything not on TMDB.

### 5.8 Stats & Analytics
- Total watched count (movies vs TV vs other).
- Genre breakdown (pie/bar chart).
- Hours watched (estimated, using runtime × episodes/movies).
- Ratings distribution (histogram).
- Watching activity over time (e.g. entries per month).

## 6. User Stories
- As the site owner, I can add a new watched entry in under 30 seconds using TMDB search.
- As the site owner, I can move something from Watchlist to Currently Watching to Watched without re-entering data.
- As the site owner, I can reorder my Top 10 and Top 5 lists by drag-and-drop.
- As a visitor, I can filter the library by "Sitcom" and see only sitcoms, sorted by rating.
- As a visitor, I can see a stats page showing genre breakdown and total hours watched.

## 7. Functional Requirements
| ID | Requirement |
|----|-------------|
| FR1 | System shall support CRUD operations on watch entries |
| FR2 | System shall integrate with TMDB API for metadata auto-fill |
| FR3 | System shall support 4 status states: Watchlist, Currently Watching, Watched, (optionally Dropped) |
| FR4 | System shall support custom, user-defined categories/genres |
| FR5 | System shall support manual ranking/reordering for Top 10 and Top 5 lists |
| FR6 | System shall compute and display aggregate stats from watch data |
| FR7 | System shall support filtering and sorting on the library and watchlist views |
| FR8 | Admin actions (add/edit/delete/reorder) shall be gated behind a simple password login |

## 8. Non-Functional Requirements
- **Performance:** Pages load in <2s on typical broadband; poster images lazy-loaded.
- **Responsiveness:** Fully usable on mobile (this is a showcase site — will be shared as a link).
- **Security:** Admin routes protected; public routes are read-only, no data mutation exposed.
- **Reliability:** TMDB API failures degrade gracefully (manual entry still works if TMDB is down).

## 9. Success Metrics (personal project, so lightweight)
- I actually keep it updated weekly.
- Adding an entry takes <30 seconds.
- Site loads well and looks good enough to share as a portfolio/personal link.

## 10. Future Enhancements (out of scope for v1)
- Public "share my list" social cards (OG images for individual entries).
- Import from Letterboxd/IMDb/Trakt.
- Episode-level tracking (mark individual episodes watched, not just shows).
- RSS/email digest of "what I watched this month."
