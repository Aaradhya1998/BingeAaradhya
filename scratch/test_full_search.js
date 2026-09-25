const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function getApiKey() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured.");
  }
  return apiKey;
}

async function tmdbFetch(path) {
  const separator = path.includes("?") ? "&" : "?";
  const url = `${TMDB_BASE_URL}${path}${separator}api_key=${getApiKey()}`;
  console.log("tmdbFetch calling URL:", url.replace(getApiKey(), "[REDACTED]"));
  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with ${response.status}`);
  }

  return await response.json();
}

async function enrichResult(result) {
  console.log("Enriching result:", result.id, result.media_type);
  const [details, credits] = await Promise.all([
    tmdbFetch(`/${result.media_type}/${result.id}`),
    tmdbFetch(`/${result.media_type}/${result.id}/credits`),
  ]);

  return {
    id: details.id,
    title: details.title ?? details.name ?? "Untitled",
  };
}

async function searchTmdb(query) {
  const normalized = query.trim().toLowerCase();

  const search = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);

  const filtered = search.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 6);

  console.log("Filtered items:", filtered.map(f => ({ id: f.id, type: f.media_type })));

  const enriched = await Promise.all(filtered.map(enrichResult));

  return enriched;
}

searchTmdb("batman")
  .then(res => console.log("SUCCESS! Enriched items count:", res.length))
  .catch(err => console.error("ERROR IN SEARCH_TMDB:", err))
  .finally(() => prisma.$disconnect());
