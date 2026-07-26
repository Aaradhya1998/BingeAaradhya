export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const entries = await prisma.entry.findMany({
    select: {
      type: true,
      genres: true,
      status: true,
    },
  });

  const types = [...new Set(entries.map((entry) => entry.type).filter(Boolean))].sort();
  const genres = [...new Set(entries.flatMap((entry) => entry.genres).filter(Boolean))].sort();
  const statuses = [...new Set(entries.map((entry) => entry.status))];

  return NextResponse.json({
    types,
    genres,
    statuses,
  });
}
