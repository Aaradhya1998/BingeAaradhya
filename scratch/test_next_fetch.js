const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function testFetch1() {
  const url = `https://api.themoviedb.org/3/search/multi?query=batman&include_adult=false&api_key=${TMDB_API_KEY}`;
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    console.log("no-store fetch status:", res.status);
    const data = await res.json();
    console.log("no-store results:", data.results ? data.results.length : 0);
  } catch (err) {
    console.error("no-store fetch failed:", err);
  }
}

testFetch1();
