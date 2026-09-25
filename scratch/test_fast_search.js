const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics"
};

function buildImage(path) {
  return path ? `${TMDB_IMAGE_BASE}${path}` : null;
}

async function fastSearch(query) {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&include_adult=false&api_key=${apiKey}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`TMDB returned ${res.status}`);
  const data = await res.json();

  const filtered = data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 8);

  return filtered.map((item) => {
    const releaseDate = item.release_date || item.first_air_date;
    const genreNames = (item.genre_ids || []).map((id) => GENRES[id]).filter(Boolean);

    return {
      id: item.id,
      mediaType: item.media_type,
      title: item.title || item.name || "Untitled",
      synopsis: item.overview || "",
      genres: genreNames,
      cast: [],
      posterUrl: buildImage(item.poster_path),
      backdropUrl: buildImage(item.backdrop_path),
      releaseYear: releaseDate ? parseInt(releaseDate.slice(0, 4), 10) : null,
      runtimeMin: null,
      totalSeasons: null,
      totalEpisodes: null,
    };
  });
}

fastSearch("batman")
  .then((results) => console.log("FAST SEARCH SUCCESS! Count:", results.length, "First:", results[0]))
  .catch((err) => console.error("FAST SEARCH ERROR:", err));
