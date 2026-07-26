-- CreateEnum
CREATE TYPE "public"."EntryStatus" AS ENUM ('WATCHLIST', 'WATCHING', 'WATCHED', 'DROPPED');

-- CreateTable
CREATE TABLE "public"."Entry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "genres" TEXT[],
    "status" "public"."EntryStatus" NOT NULL,
    "rating" DOUBLE PRECISION,
    "notes" TEXT,
    "synopsis" TEXT,
    "cast" TEXT[],
    "posterUrl" TEXT,
    "backdropUrl" TEXT,
    "tmdbId" INTEGER,
    "tmdbType" TEXT,
    "releaseYear" INTEGER,
    "runtimeMin" INTEGER,
    "progressText" TEXT,
    "unitsConsumed" INTEGER NOT NULL DEFAULT 1,
    "totalSeasons" INTEGER,
    "totalEpisodes" INTEGER,
    "priority" INTEGER,
    "isTop10" BOOLEAN NOT NULL DEFAULT false,
    "isTop5Rec" BOOLEAN NOT NULL DEFAULT false,
    "top10Rank" INTEGER,
    "top5Rank" INTEGER,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateStarted" TIMESTAMP(3),
    "dateWatched" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TmdbCache" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TmdbCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entry_status_idx" ON "public"."Entry"("status");

-- CreateIndex
CREATE INDEX "Entry_type_idx" ON "public"."Entry"("type");

-- CreateIndex
CREATE INDEX "Entry_isTop10_top10Rank_idx" ON "public"."Entry"("isTop10", "top10Rank");

-- CreateIndex
CREATE INDEX "Entry_isTop5Rec_top5Rank_idx" ON "public"."Entry"("isTop5Rec", "top5Rank");

-- CreateIndex
CREATE INDEX "Entry_dateWatched_idx" ON "public"."Entry"("dateWatched");

-- CreateIndex
CREATE UNIQUE INDEX "TmdbCache_query_key" ON "public"."TmdbCache"("query");

-- CreateIndex
CREATE INDEX "TmdbCache_expiresAt_idx" ON "public"."TmdbCache"("expiresAt");
