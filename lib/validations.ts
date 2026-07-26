import { z } from "zod";

export const entryStatusValues = ["WATCHLIST", "WATCHING", "WATCHED", "DROPPED"] as const;

const nullableNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

  return value;
}, z.coerce.number().nullable());

const nullableInteger = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

  return value;
}, z.coerce.number().int().nullable());

const dateField = z
  .string()
  .optional()
  .nullable()
  .transform((value) => (value ? new Date(value) : null));

export const entrySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  type: z.string().min(1),
  genres: z.array(z.string()).default([]),
  status: z.enum(entryStatusValues),
  rating: nullableNumber.refine(
    (value) => value === null || (value >= 0 && value <= 10),
    "Rating must be between 0 and 10.",
  ),
  notes: z.string().optional().nullable(),
  synopsis: z.string().optional().nullable(),
  cast: z.array(z.string()).default([]),
  posterUrl: z.string().url().optional().nullable().or(z.literal("")),
  backdropUrl: z.string().url().optional().nullable().or(z.literal("")),
  tmdbId: nullableInteger,
  tmdbType: z.string().optional().nullable(),
  releaseYear: nullableInteger,
  runtimeMin: nullableInteger,
  progressText: z.string().optional().nullable(),
  unitsConsumed: z.coerce.number().int().min(1).default(1),
  totalSeasons: nullableInteger,
  totalEpisodes: nullableInteger,
  priority: nullableInteger,
  isTop10: z.coerce.boolean().default(false),
  isTop5Rec: z.coerce.boolean().default(false),
  top10Rank: nullableInteger,
  top5Rank: nullableInteger,
  dateStarted: dateField,
  dateWatched: dateField,
});

export const entryQuerySchema = z.object({
  status: z.enum(entryStatusValues).optional(),
  type: z.string().optional(),
  genre: z.string().optional(),
  sort: z.enum(["date", "rating", "title"]).default("date"),
  ranked: z.enum(["top10", "top5"]).optional(),
  search: z.string().optional(),
});

export const reorderSchema = z.object({
  list: z.enum(["top10", "top5"]),
  ids: z.array(z.string()).min(1),
});

export const loginSchema = z.object({
  password: z.string().min(1),
});
