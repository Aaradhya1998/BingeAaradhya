import { prisma } from "@/lib/prisma";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

export type TmdbResult = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  synopsis: string;
  genres: string[];
  cast: string[];
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseYear: number | null;
  runtimeMin: number | null;
  totalSeasons: number | null;
  totalEpisodes: number | null;
};

const TMDB_GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured in environment variables.");
  }

  return apiKey.trim();
}

function buildImage(path?: string | null) {
  return path ? `${TMDB_IMAGE_BASE}${path}` : null;
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const apiKey = getApiKey();
  const separator = path.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE_URL}${path}${separator}api_key=${apiKey}`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`TMDB HTTP ${response.status}: ${errorText || response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function searchTmdb(query: string): Promise<TmdbResult[]> {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  // 1. Check cache first
  try {
    const cached = await prisma.tmdbCache.findUnique({
      where: { query: normalized },
    });

    if (cached && cached.expiresAt > new Date()) {
      return cached.response as TmdbResult[];
    }
  } catch (err) {
    console.warn("[TMDB Cache Read Failed]:", err);
  }

  // 2. Fetch multi-search results
  const searchData = await tmdbFetch<{
    results: Array<{
      id: number;
      media_type: "movie" | "tv" | "person";
      title?: string;
      name?: string;
      overview?: string;
      genre_ids?: number[];
      poster_path?: string | null;
      backdrop_path?: string | null;
      release_date?: string;
      first_air_date?: string;
    }>;
  }>(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);

  const filtered = (searchData.results || [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 6);

  // 3. Enrich items with fallback protection so sub-request rate limits/socket resets don't crash the search
  const enriched: TmdbResult[] = await Promise.all(
    filtered.map(async (item) => {
      const releaseDate = item.release_date || item.first_air_date;
      const genreNames = (item.genre_ids || [])
        .map((id) => TMDB_GENRES[id])
        .filter(Boolean);

      const baseResult: TmdbResult = {
        id: item.id,
        mediaType: item.media_type as "movie" | "tv",
        title: item.title || item.name || "Untitled",
        synopsis: item.overview || "",
        genres: genreNames,
        cast: [],
        posterUrl: buildImage(item.poster_path),
        backdropUrl: buildImage(item.backdrop_path),
        releaseYear: releaseDate ? Number.parseInt(String(releaseDate).slice(0, 4), 10) : null,
        runtimeMin: null,
        totalSeasons: null,
        totalEpisodes: null,
      };

      try {
        const [details, credits] = await Promise.all([
          tmdbFetch<{
            runtime?: number | null;
            episode_run_time?: number[];
            number_of_seasons?: number | null;
            number_of_episodes?: number | null;
            genres?: Array<{ name: string }>;
          }>(`/${item.media_type}/${item.id}`),
          tmdbFetch<{
            cast?: Array<{ name: string }>;
          }>(`/${item.media_type}/${item.id}/credits`),
        ]);

        if (details.genres && details.genres.length > 0) {
          baseResult.genres = details.genres.map((g) => g.name);
        }
        if (credits.cast && credits.cast.length > 0) {
          baseResult.cast = credits.cast.slice(0, 5).map((p) => p.name);
        }
        baseResult.runtimeMin =
          item.media_type === "movie"
            ? details.runtime ?? null
            : details.episode_run_time?.[0] ?? null;
        baseResult.totalSeasons = details.number_of_seasons ?? null;
        baseResult.totalEpisodes = details.number_of_episodes ?? null;
      } catch (e) {
        console.warn(`[TMDB Sub-request Fallback] ${item.media_type}/${item.id}:`, e);
      }

      return baseResult;
    })
  );

  // 4. Save to cache
  try {
    await prisma.tmdbCache.upsert({
      where: { query: normalized },
      update: {
        response: enriched,
        fetchedAt: new Date(),
        expiresAt: new Date(Date.now() + CACHE_TTL_MS),
      },
      create: {
        query: normalized,
        response: enriched,
        expiresAt: new Date(Date.now() + CACHE_TTL_MS),
      },
    });
  } catch (err) {
    console.warn("[TMDB Cache Write Failed]:", err);
  }

  return enriched;
}
