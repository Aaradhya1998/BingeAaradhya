const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

const TMDB_GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error("TMDB_API_KEY is not configured.");
  return apiKey.trim();
}

function buildImage(path) {
  return path ? `${TMDB_IMAGE_BASE}${path}` : null;
}

async function tmdbFetch(path) {
  const apiKey = getApiKey();
  const separator = path.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE_URL}${path}${separator}api_key=${apiKey}`;

  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`TMDB HTTP ${response.status}: ${errorText || response.statusText}`);
  }

  return await response.json();
}

async function searchTmdb(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const searchData = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);

  const filtered = (searchData.results || [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 6);

  const enriched = await Promise.all(
    filtered.map(async (item) => {
      const releaseDate = item.release_date || item.first_air_date;
      const genreNames = (item.genre_ids || [])
        .map((id) => TMDB_GENRES[id])
        .filter(Boolean);

      const baseResult = {
        id: item.id,
        mediaType: item.media_type,
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
          tmdbFetch(`/${item.media_type}/${item.id}`),
          tmdbFetch(`/${item.media_type}/${item.id}/credits`),
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
        console.warn(`Enrichment fallback for ${item.media_type} ${item.id}:`, e.message);
      }

      return baseResult;
    })
  );

  return enriched;
}

searchTmdb("batman")
  .then((results) => {
    console.log("\nSEARCH RESULTS SUCCESS!");
    console.log("Total results:", results.length);
    console.log("Sample result 1:", results[0]);
  })
  .catch((err) => console.error("FATAL ERROR:", err))
  .finally(() => prisma.$disconnect());
