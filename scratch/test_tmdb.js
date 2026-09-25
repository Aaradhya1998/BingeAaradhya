const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TMDB_API_KEY = process.env.TMDB_API_KEY;
console.log("TMDB_API_KEY present:", Boolean(TMDB_API_KEY), "Length:", TMDB_API_KEY ? TMDB_API_KEY.length : 0);

async function testFetch() {
  const url = `https://api.themoviedb.org/3/search/multi?query=batman&api_key=${TMDB_API_KEY}`;
  console.log("Fetching:", url.replace(TMDB_API_KEY, "[REDACTED]"));
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    console.log("Status:", res.status, res.statusText);
    const json = await res.json();
    console.log("Results count:", json.results ? json.results.length : 0);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testFetch();
