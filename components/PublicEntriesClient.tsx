"use client";

import { useEffect, useState } from "react";
import type { EntryRecord, FilterOptions } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";
import { FilterBar } from "@/components/FilterBar";
import { CategoryPills } from "@/components/CategoryPills";
import { Film } from "lucide-react";

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
      .then((data) => setEntries(data.entries));
  }, [query, status]);

  return (
    <div className="space-y-6">
      {/* Category Pills Switcher */}
      {filters.genres.length > 0 && (
        <CategoryPills
          selectedCategory={query.genre}
          onSelectCategory={(genre) => setQuery((prev) => ({ ...prev, genre }))}
          categories={filters.genres}
        />
      )}

      {/* Advanced FilterBar */}
      <FilterBar
        genre={query.genre}
        type={query.type}
        sort={query.sort}
        search={query.search}
        genres={filters.genres}
        types={filters.types}
        onChange={setQuery}
      />

      {/* Loading Skeletons */}
      {entries === null && (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] animate-pulse rounded-[18px] border border-white/5 bg-white/[0.04]"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {entries?.length === 0 && (
        <div className="glass-panel p-12 text-center text-sm text-slate-400">
          <Film className="mx-auto h-10 w-10 text-slate-500 opacity-40 mb-3" />
          <p className="font-semibold text-white">No entries match your filters</p>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search terms or clearing selected categories.
          </p>
          {(query.search || query.genre || query.type) && (
            <button
              type="button"
              onClick={() =>
                setQuery({ genre: "", type: "", sort: "date", search: "" })
              }
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f5a623] px-5 py-2 text-xs font-bold text-slate-950 shadow-[0_0_15px_rgba(245,166,35,0.3)]"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* 6-Column Card Grid */}
      {entries && entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
