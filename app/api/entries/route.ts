import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { readAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { entryQuerySchema, entrySchema, reorderSchema } from "@/lib/validations";

function normalizeEntryData(data: ReturnType<typeof entrySchema.parse>) {
  return {
    title: data.title,
    type: data.type,
    genres: data.genres,
    status: data.status,
    rating: data.rating ?? null,
    notes: data.notes || null,
    synopsis: data.synopsis || null,
    cast: data.cast,
    posterUrl: data.posterUrl || null,
    backdropUrl: data.backdropUrl || null,
    tmdbId: data.tmdbId ?? null,
    tmdbType: data.tmdbType || null,
    releaseYear: data.releaseYear ?? null,
    runtimeMin: data.runtimeMin ?? null,
    progressText: data.progressText || null,
    unitsConsumed: data.unitsConsumed,
    totalSeasons: data.totalSeasons ?? null,
    totalEpisodes: data.totalEpisodes ?? null,
    priority: data.priority ?? null,
    isTop10: data.isTop10,
    isTop5Rec: data.isTop5Rec,
    top10Rank: data.isTop10 ? data.top10Rank ?? undefined : null,
    top5Rank: data.isTop5Rec ? data.top5Rank ?? undefined : null,
    dateStarted: data.dateStarted,
    dateWatched: data.dateWatched,
  };
}

async function ensureAdmin() {
  const session = await readAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = entryQuerySchema.parse({
    status: url.searchParams.get("status") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
    genre: url.searchParams.get("genre") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
    ranked: url.searchParams.get("ranked") ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
  });

  const where: Prisma.EntryWhereInput = {};

  if (query.status) where.status = query.status;
  if (query.type) where.type = query.type;
  if (query.genre) where.genres = { has: query.genre };
  if (query.search) where.title = { contains: query.search, mode: "insensitive" };
  if (query.ranked === "top10") where.isTop10 = true;
  if (query.ranked === "top5") where.isTop5Rec = true;

  const orderBy: Prisma.EntryOrderByWithRelationInput[] =
    query.sort === "rating"
      ? [{ rating: "desc" }, { dateWatched: "desc" }]
      : query.sort === "title"
        ? [{ title: "asc" }]
        : [{ dateWatched: "desc" }, { dateAdded: "desc" }];

  if (query.ranked === "top10") {
    orderBy.unshift({ top10Rank: "asc" });
  }

  if (query.ranked === "top5") {
    orderBy.unshift({ top5Rank: "asc" });
  }

  const entries = await prisma.entry.findMany({ where, orderBy });
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  try {
    await ensureAdmin();
    const data = entrySchema.parse(await request.json());
    const created = await prisma.entry.create({
      data: normalizeEntryData(data),
    });
    return NextResponse.json({ entry: created });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create entry." },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 400 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    await ensureAdmin();
    const data = entrySchema.parse(await request.json());

    if (!data.id) {
      return NextResponse.json({ error: "Entry id is required." }, { status: 400 });
    }

    const updated = await prisma.entry.update({
      where: { id: data.id },
      data: normalizeEntryData(data),
    });
    return NextResponse.json({ entry: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update entry." },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 400 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await ensureAdmin();
    const data = reorderSchema.parse(await request.json());
    await prisma.$transaction(
      data.ids.map((id, index) =>
        prisma.entry.update({
          where: { id },
          data:
            data.list === "top10"
              ? { top10Rank: index + 1, isTop10: true }
              : { top5Rank: index + 1, isTop5Rec: true },
        }),
      ),
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reorder entries." },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureAdmin();
    const { id } = (await request.json()) as { id?: string };

    if (!id) {
      return NextResponse.json({ error: "Entry id is required." }, { status: 400 });
    }

    await prisma.entry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete entry." },
      { status: error instanceof Error && error.message === "Unauthorized" ? 401 : 400 },
    );
  }
}
