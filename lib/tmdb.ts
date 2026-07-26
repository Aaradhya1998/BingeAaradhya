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

type TmdbDetailsResponse = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  genres?: Array<{ name: string }>;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  runtime?: number | null;
  episode_run_time?: number[];
  number_of_seasons?: number | null;
  number_of_episodes?: number | null;
};

type TmdbCreditsResponse = {
  cast?: Array<{ name: string }>;
};

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured.");
  }

  return apiKey;
}

function buildImage(path?: string | null) {
  return path ? `${TMDB_IMAGE_BASE}${path}` : null;
}

async function tmdbFetch<T>(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${TMDB_BASE_URL}${path}${separator}api_key=${getApiKey()}`, {
    headers: {
      accept: "application/json",
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

async function enrichResult(result: { id: number; media_type: "movie" | "tv" }) {
  const [details, credits] = await Promise.all([
    tmdbFetch<TmdbDetailsResponse>(`/${result.media_type}/${result.id}`),
    tmdbFetch<TmdbCreditsResponse>(`/${result.media_type}/${result.id}/credits`),
  ]);

  const releaseDate =
    result.media_type === "movie" ? details.release_date : details.first_air_date;

  return {
    id: details.id,
    mediaType: result.media_type,
    title: details.title ?? details.name ?? "Untitled",
    synopsis: details.overview ?? "",
    genres: Array.isArray(details.genres)
      ? details.genres.map((genre: { name: string }) => genre.name)
      : [],
    cast: Array.isArray(credits.cast)
      ? credits.cast.slice(0, 5).map((person: { name: string }) => person.name)
      : [],
    posterUrl: buildImage(details.poster_path),
    backdropUrl: buildImage(details.backdrop_path),
    releaseYear: releaseDate ? Number.parseInt(String(releaseDate).slice(0, 4), 10) : null,
    runtimeMin:
      result.media_type === "movie"
        ? details.runtime ?? null
        : details.episode_run_time?.[0] ?? null,
    totalSeasons: details.number_of_seasons ?? null,
    totalEpisodes: details.number_of_episodes ?? null,
  } satisfies TmdbResult;
}

export async function searchTmdb(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const cached = await prisma.tmdbCache.findUnique({
    where: { query: normalized },
  });

  if (cached && cached.expiresAt > new Date()) {
    return cached.response as TmdbResult[];
  }

  const search = await tmdbFetch<{
    results: Array<{ id: number; media_type: "movie" | "tv" | "person" }>;
  }>(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);

  const filtered = search.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 6) as Array<{ id: number; media_type: "movie" | "tv" }>;

  const enriched = await Promise.all(filtered.map(enrichResult));

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

  return enriched;
}
