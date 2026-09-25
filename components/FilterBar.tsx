"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";

type Props = {
  genre: string;
  type: string;
  sort: "date" | "rating" | "title";
  search: string;
  genres: string[];
  types: string[];
  onChange: (value: {
    genre: string;
    type: string;
    sort: "date" | "rating" | "title";
    search: string;
  }) => void;
};

export function FilterBar(props: Props) {
  return (
    <div className="glass-panel grid gap-3 p-4 md:grid-cols-4">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={props.search}
          onChange={(event) =>
            props.onChange({
              genre: props.genre,
              type: props.type,
              sort: props.sort,
              search: event.target.value,
            })
          }
          placeholder="Search by title, actor..."
          className="h-11 w-full rounded-2xl border border-white/10 bg-black/40 pl-10 pr-4 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-colors focus:border-[#f5a623] focus:outline-none focus:ring-1 focus:ring-[#f5a623]"
        />
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
      </div>

      {/* Type Filter */}
      <div className="relative">
        <select
          value={props.type}
          onChange={(event) =>
            props.onChange({
              genre: props.genre,
              type: event.target.value,
              sort: props.sort,
              search: props.search,
            })
          }
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 text-sm text-slate-200 backdrop-blur-md transition-colors focus:border-[#f5a623] focus:outline-none"
        >
          <option value="" className="bg-slate-900 text-slate-200">
            All Types
          </option>
          {props.types.map((type) => (
            <option key={type} value={type} className="bg-slate-900 text-slate-200">
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Genre Filter */}
      <div className="relative">
        <select
          value={props.genre}
          onChange={(event) =>
            props.onChange({
              genre: event.target.value,
              type: props.type,
              sort: props.sort,
              search: props.search,
            })
          }
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 text-sm text-slate-200 backdrop-blur-md transition-colors focus:border-[#f5a623] focus:outline-none"
        >
          <option value="" className="bg-slate-900 text-slate-200">
            All Categories
          </option>
          {props.genres.map((genre) => (
            <option key={genre} value={genre} className="bg-slate-900 text-slate-200">
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="relative">
        <select
          value={props.sort}
          onChange={(event) =>
            props.onChange({
              genre: props.genre,
              type: props.type,
              sort: event.target.value as "date" | "rating" | "title",
              search: props.search,
            })
          }
          className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/90 px-4 text-sm text-slate-200 backdrop-blur-md transition-colors focus:border-[#f5a623] focus:outline-none"
        >
          <option value="date" className="bg-slate-900 text-slate-200">
            Sort by Date Watched
          </option>
          <option value="rating" className="bg-slate-900 text-slate-200">
            Sort by Rating (Highest)
          </option>
          <option value="title" className="bg-slate-900 text-slate-200">
            Sort by Title (A-Z)
          </option>
        </select>
      </div>
    </div>
  );
}
