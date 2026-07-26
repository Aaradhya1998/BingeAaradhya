export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.entry.findMany();
  const watched = entries.filter((entry) => entry.status === "WATCHED");
  const watching = entries.filter((entry) => entry.status === "WATCHING");
  const watchlist = entries.filter((entry) => entry.status === "WATCHLIST");

  const byTypeMap = new Map<string, number>();
  const byGenreMap = new Map<string, number>();
  const ratingsMap = new Map<string, number>();
  const activityMap = new Map<string, { key: string; value: number }>();

  let totalRuntime = 0;

  for (const entry of watched) {
    byTypeMap.set(entry.type, (byTypeMap.get(entry.type) ?? 0) + 1);

    for (const genre of entry.genres) {
      byGenreMap.set(genre, (byGenreMap.get(genre) ?? 0) + 1);
    }

    if (typeof entry.rating === "number") {
      const bucket = `${Math.floor(entry.rating)}`;
      ratingsMap.set(bucket, (ratingsMap.get(bucket) ?? 0) + 1);
    }

    if (entry.dateWatched) {
      const date = new Date(entry.dateWatched);
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      const label = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "2-digit",
      }).format(date);
      const existing = activityMap.get(label);
      activityMap.set(label, {
        key,
        value: (existing?.value ?? 0) + 1,
      });
    }

    totalRuntime += (entry.runtimeMin ?? 0) * (entry.unitsConsumed || 1);
  }

  return NextResponse.json({
    totals: {
      watched: watched.length,
      watchlist: watchlist.length,
      watching: watching.length,
      hoursWatched: Number((totalRuntime / 60).toFixed(1)),
    },
    byType: [...byTypeMap.entries()].map(([label, value]) => ({ label, value })),
    byGenre: [...byGenreMap.entries()].map(([label, value]) => ({ label, value })),
    ratings: [...ratingsMap.entries()].map(([label, value]) => ({ label, value })),
    activity: [...activityMap.entries()]
      .sort((a, b) => a[1].key.localeCompare(b[1].key))
      .map(([label, payload]) => ({ label, value: payload.value })),
  });
}
