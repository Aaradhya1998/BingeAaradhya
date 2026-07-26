import type { Entry, EntryStatus } from "@prisma/client";

export type EntryRecord = Entry;

export type FilterOptions = {
  statuses: EntryStatus[];
  types: string[];
  genres: string[];
};

export type StatsPayload = {
  totals: {
    watched: number;
    watchlist: number;
    watching: number;
    hoursWatched: number;
  };
  byType: Array<{ label: string; value: number }>;
  byGenre: Array<{ label: string; value: number }>;
  ratings: Array<{ label: string; value: number }>;
  activity: Array<{ label: string; value: number }>;
};
