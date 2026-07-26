"use client";

import { Input } from "@/components/ui/input";

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
    <div className="surface grid gap-3 p-4 md:grid-cols-4">
      <Input
        value={props.search}
        onChange={(event) =>
          props.onChange({
            genre: props.genre,
            type: props.type,
            sort: props.sort,
            search: event.target.value,
          })
        }
        placeholder="Search titles"
      />
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
        className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm"
      >
        <option value="">All types</option>
        {props.types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
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
        className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm"
      >
        <option value="">All categories</option>
        {props.genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
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
        className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm"
      >
        <option value="date">Sort by date</option>
        <option value="rating">Sort by rating</option>
        <option value="title">Sort by title</option>
      </select>
    </div>
  );
}
