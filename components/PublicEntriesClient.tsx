"use client";

import { useEffect, useState } from "react";

import type { EntryRecord, FilterOptions } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";
import { FilterBar } from "@/components/FilterBar";

type QueryState = {
  genre: string;
  type: string;
  sort: "date" | "rating" | "title";
  search: string;
};

export function PublicEntriesClient({
  status,
}: {
  status: "WATCHED" | "WATCHLIST";
}) {
  const [entries, setEntries] = useState<EntryRecord[] | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    statuses: [],
    types: [],
    genres: [],
  });
  const [query, setQuery] = useState<QueryState>({
    genre: "",
    type: "",
    sort: "date",
    search: "",
  });
  useEffect(() => {
    void fetch("/api/filters")
      .then((response) => response.json())
      .then(setFilters);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      status,
      sort: query.sort,
    });

    if (query.genre) params.set("genre", query.genre);
    if (query.type) params.set("type", query.type);
    if (query.search) params.set("search", query.search);

    void fetch(`/api/entries?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setEntries(data.entries))
  }, [query, status]);

  return (
    <div className="space-y-6">
      <FilterBar
        genre={query.genre}
        type={query.type}
        sort={query.sort}
        search={query.search}
        genres={filters.genres}
        types={filters.types}
        onChange={setQuery}
      />
      {entries === null ? <p className="text-sm text-muted-foreground">Loading entries...</p> : null}
      {entries?.length === 0 ? (
        <div className="surface p-8 text-center text-sm text-muted-foreground">
          No entries match these filters yet.
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {entries?.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
