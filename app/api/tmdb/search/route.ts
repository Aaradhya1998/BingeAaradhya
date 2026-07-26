import { NextResponse } from "next/server";

import { searchTmdb } from "@/lib/tmdb";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchTmdb(query);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `${error.message} Manual entry is still available.`
            : "TMDB search unavailable. Manual entry is still available.",
      },
      { status: 503 },
    );
  }
}
