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
  } catch (error: any) {
    console.error("[TMDB Search Route Error]:", error);
    if (error?.cause) console.error("[TMDB Cause]:", error.cause);
    const errorMessage =
      error instanceof Error ? error.message : "TMDB search request failed";

    return NextResponse.json(
      {
        error: `TMDB Search Error: ${errorMessage} (${error?.cause?.message || error?.cause?.code || ''}). Manual entry is still available.`,
      },
      { status: 500 },
    );
  }
}
