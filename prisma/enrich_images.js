const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY || "229655663205667233079ae057f1428d";

async function enrichAll() {
  const entries = await prisma.entry.findMany();
  console.log(`Enriching ${entries.length} entries with real TMDB imagery...`);

  for (const entry of entries) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(entry.title)}&api_key=${TMDB_API_KEY}`
      ).then((r) => r.json());

      const match = res.results?.find(
        (r) => r.media_type === "movie" || r.media_type === "tv"
      ) || res.results?.[0];

      if (match) {
        const posterUrl = match.poster_path
          ? `https://image.tmdb.org/t/p/w500${match.poster_path}`
          : entry.posterUrl;
        const backdropUrl = match.backdrop_path
          ? `https://image.tmdb.org/t/p/original${match.backdrop_path}`
          : entry.backdropUrl;

        await prisma.entry.update({
          where: { id: entry.id },
          data: {
            posterUrl,
            backdropUrl,
            releaseYear: entry.releaseYear || (match.release_date || match.first_air_date ? parseInt(match.release_date || match.first_air_date) : null),
          },
        });
        console.log(`✓ Updated "${entry.title}" -> poster: ${match.poster_path}, backdrop: ${match.backdrop_path}`);
      }
    } catch (e) {
      console.error(`Error updating "${entry.title}":`, e.message);
    }
  }
  console.log("Enrichment complete.");
  await prisma.$disconnect();
}

enrichAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
