"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, ArrowUpDown, Sparkles } from "lucide-react";
import type { EntryRecord } from "@/lib/types";
import { CategoryPills } from "@/components/CategoryPills";
import { EntryCard } from "@/components/EntryCard";

interface HomeTrendingSectionProps {
  initialEntries: EntryRecord[];
  allGenres: string[];
}

export function HomeTrendingSection({
  initialEntries,
  allGenres,
}: HomeTrendingSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "rating" | "year">("rank");

  // Filter entries based on selectedCategory
  const filteredEntries = useMemo(() => {
    let result = [...initialEntries];

    if (selectedCategory) {
      result = result.filter((entry) =>
        entry.genres.some(
          (g) => g.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    if (sortBy === "rating") {
      result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === "year") {
      result.sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0));
    } else {
      // by rank / default
      result.sort((a, b) => (a.top10Rank ?? 99) - (b.top10Rank ?? 99));
    }

    return result;
  }, [initialEntries, selectedCategory, sortBy]);

  const headingText = selectedCategory
    ? `Trending in ${selectedCategory}`
    : "Top 10 Masterpieces";

  return (
    <section className="space-y-6">
      {/* 3. Category Filter Pills Row */}
      <div className="pt-2">
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={allGenres}
        />
      </div>

      {/* 4. Section Heading with filter/sort controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {headingText}
            </h2>
            <span className="flex h-5 items-center justify-center rounded-full bg-white/10 px-2 text-xs font-medium text-slate-300">
              {filteredEntries.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Aaradhya&apos;s all-time rated & ranked cinema showcase
          </p>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.06] p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setSortBy("rank")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                sortBy === "rank"
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Rank
            </button>
            <button
              type="button"
              onClick={() => setSortBy("rating")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                sortBy === "rating"
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Rating
            </button>
            <button
              type="button"
              onClick={() => setSortBy("year")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                sortBy === "year"
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Year
            </button>
          </div>

          <Link
            href="/library"
            className="flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 text-xs font-medium text-slate-300 hover:border-white/25 hover:bg-white/[0.12] hover:text-white backdrop-blur-md transition-all"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">All Filters</span>
          </Link>
        </div>
      </div>

      {/* 5. 6-Column Responsive Card Grid */}
      {initialEntries.length === 0 ? (
        <div className="glass-panel p-10 text-center text-sm text-slate-400 sm:p-12">
          <Sparkles className="mx-auto h-9 w-9 text-[#f5a623] opacity-60 mb-2" />
          <p className="font-bold text-lg text-white">No Top 10 Entries Yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Log movies and TV shows in your library to start building your top list.
          </p>
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredEntries.map((entry, index) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              rank={sortBy === "rank" ? index + 1 : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-10 text-center text-sm text-slate-400">
          No entries found in <span className="font-semibold text-white">&quot;{selectedCategory}&quot;</span>.
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className="ml-2 text-[#f5a623] underline underline-offset-4 hover:text-[#ffb733]"
          >
            View all
          </button>
        </div>
      )}
    </section>
  );
}
