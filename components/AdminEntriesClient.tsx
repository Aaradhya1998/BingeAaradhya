"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { EntryRecord } from "@/lib/types";
import type { TmdbResult } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RankedList } from "@/components/RankedList";

type EntryForm = {
  id?: string;
  title: string;
  type: string;
  genres: string;
  status: "WATCHLIST" | "WATCHING" | "WATCHED" | "DROPPED";
  rating: string;
  notes: string;
  synopsis: string;
  cast: string;
  posterUrl: string;
  backdropUrl: string;
  tmdbId: string;
  tmdbType: string;
  releaseYear: string;
  runtimeMin: string;
  progressText: string;
  unitsConsumed: string;
  totalSeasons: string;
  totalEpisodes: string;
  priority: string;
  isTop10: boolean;
  isTop5Rec: boolean;
  dateStarted: string;
  dateWatched: string;
};

const emptyForm: EntryForm = {
  title: "",
  type: "Movie",
  genres: "",
  status: "WATCHLIST",
  rating: "",
  notes: "",
  synopsis: "",
  cast: "",
  posterUrl: "",
  backdropUrl: "",
  tmdbId: "",
  tmdbType: "",
  releaseYear: "",
  runtimeMin: "",
  progressText: "",
  unitsConsumed: "1",
  totalSeasons: "",
  totalEpisodes: "",
  priority: "",
  isTop10: false,
  isTop5Rec: false,
  dateStarted: "",
  dateWatched: "",
};

function toForm(entry?: EntryRecord): EntryForm {
  if (!entry) {
    return emptyForm;
  }

  return {
    id: entry.id,
    title: entry.title,
    type: entry.type,
    genres: entry.genres.join(", "),
    status: entry.status,
    rating: entry.rating?.toString() ?? "",
    notes: entry.notes ?? "",
    synopsis: entry.synopsis ?? "",
    cast: entry.cast.join(", "),
    posterUrl: entry.posterUrl ?? "",
    backdropUrl: entry.backdropUrl ?? "",
    tmdbId: entry.tmdbId?.toString() ?? "",
    tmdbType: entry.tmdbType ?? "",
    releaseYear: entry.releaseYear?.toString() ?? "",
    runtimeMin: entry.runtimeMin?.toString() ?? "",
    progressText: entry.progressText ?? "",
    unitsConsumed: String(entry.unitsConsumed ?? 1),
    totalSeasons: entry.totalSeasons?.toString() ?? "",
    totalEpisodes: entry.totalEpisodes?.toString() ?? "",
    priority: entry.priority?.toString() ?? "",
    isTop10: entry.isTop10,
    isTop5Rec: entry.isTop5Rec,
    dateStarted: entry.dateStarted ? new Date(entry.dateStarted).toISOString().slice(0, 10) : "",
    dateWatched: entry.dateWatched ? new Date(entry.dateWatched).toISOString().slice(0, 10) : "",
  };
}

function fromTmdb(result: TmdbResult): EntryForm {
  return {
    ...emptyForm,
    title: result.title,
    type: result.mediaType === "movie" ? "Movie" : "TV",
    genres: result.genres.join(", "),
    synopsis: result.synopsis,
    cast: result.cast.join(", "),
    posterUrl: result.posterUrl ?? "",
    backdropUrl: result.backdropUrl ?? "",
    tmdbId: String(result.id),
    tmdbType: result.mediaType,
    releaseYear: result.releaseYear?.toString() ?? "",
    runtimeMin: result.runtimeMin?.toString() ?? "",
    totalSeasons: result.totalSeasons?.toString() ?? "",
    totalEpisodes: result.totalEpisodes?.toString() ?? "",
  };
}

function normalizePayload(form: EntryForm) {
  return {
    ...form,
    genres: form.genres
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    cast: form.cast
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    rating: form.rating || null,
    releaseYear: form.releaseYear || null,
    runtimeMin: form.runtimeMin || null,
    tmdbId: form.tmdbId || null,
    progressText: form.progressText || null,
    unitsConsumed: form.unitsConsumed || "1",
    totalSeasons: form.totalSeasons || null,
    totalEpisodes: form.totalEpisodes || null,
    priority: form.priority || null,
    notes: form.notes || null,
    synopsis: form.synopsis || null,
    posterUrl: form.posterUrl || null,
    backdropUrl: form.backdropUrl || null,
    dateStarted: form.dateStarted || null,
    dateWatched: form.dateWatched || null,
  };
}

export function AdminEntriesClient({ initialEntries }: { initialEntries: EntryRecord[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState<EntryForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const response = await fetch("/api/entries?sort=date", {
      credentials: "include",
    });
    const data = await response.json();
    setEntries(data.entries);
    router.refresh();
  }

  async function handleTmdbSearch() {
    setMessage(null);
    const response = await fetch(`/api/tmdb/search?q=${encodeURIComponent(search)}`);
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "TMDB search failed.");
      return;
    }

    setResults(data.results);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const method = form.id ? "PUT" : "POST";
    const response = await fetch("/api/entries", {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizePayload(form)),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Unable to save entry.");
      return;
    }

    setForm(emptyForm);
    setResults([]);
    setSearch("");
    setMessage("Entry saved.");
    await refresh();
  }

  async function handleDelete(id: string) {
    const response = await fetch("/api/entries", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setMessage("Entry deleted.");
      await refresh();
    }
  }

  async function persistRank(list: "top10" | "top5", ids: string[]) {
    await fetch("/api/entries", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ list, ids }),
    });
    await refresh();
  }

  const top10 = entries
    .filter((entry) => entry.isTop10)
    .sort((a, b) => (a.top10Rank ?? 999) - (b.top10Rank ?? 999));

  const top5 = entries
    .filter((entry) => entry.isTop5Rec)
    .sort((a, b) => (a.top5Rank ?? 999) - (b.top5Rank ?? 999));

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Entry management</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add manually or use TMDB to prefill fields. Everything stays editable.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search TMDB"
              />
              <Button type="button" onClick={handleTmdbSearch}>
                Search TMDB
              </Button>
            </div>
            {results.length ? (
              <div className="grid gap-3">
                {results.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    className="rounded-2xl border border-black/10 bg-secondary/40 p-3 text-left"
                    onClick={() => setForm(fromTmdb(result))}
                  >
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.releaseYear ?? "Year unknown"} • {result.genres.join(", ")}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required />
              <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type" required />
              <Input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} placeholder="Genres, comma separated" />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as EntryForm["status"] })}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm"
              >
                <option value="WATCHLIST">Watchlist</option>
                <option value="WATCHING">Currently Watching</option>
                <option value="WATCHED">Watched</option>
                <option value="DROPPED">Dropped</option>
              </select>
              <Input value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="Rating /10" />
              <Input value={form.progressText} onChange={(e) => setForm({ ...form, progressText: e.target.value })} placeholder="Progress e.g. S2E4" />
              <Input value={form.releaseYear} onChange={(e) => setForm({ ...form, releaseYear: e.target.value })} placeholder="Release year" />
              <Input value={form.runtimeMin} onChange={(e) => setForm({ ...form, runtimeMin: e.target.value })} placeholder="Runtime per episode/movie (min)" />
              <Input value={form.unitsConsumed} onChange={(e) => setForm({ ...form, unitsConsumed: e.target.value })} placeholder="Episodes or view count" />
              <Input value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} placeholder="Watchlist priority" />
              <Input type="date" value={form.dateStarted} onChange={(e) => setForm({ ...form, dateStarted: e.target.value })} />
              <Input type="date" value={form.dateWatched} onChange={(e) => setForm({ ...form, dateWatched: e.target.value })} />
              <Input value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} placeholder="Poster URL" className="md:col-span-2" />
              <Input value={form.cast} onChange={(e) => setForm({ ...form, cast: e.target.value })} placeholder="Cast, comma separated" className="md:col-span-2" />
              <Textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} placeholder="Synopsis" className="md:col-span-2" />
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Short note or thoughts" className="md:col-span-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isTop10} onChange={(e) => setForm({ ...form, isTop10: e.target.checked })} />
                Include in Top 10
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isTop5Rec} onChange={(e) => setForm({ ...form, isTop5Rec: e.target.checked })} />
                Include in Top 5 Recommendations
              </label>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <Button type="submit">
                  {form.id ? "Update entry" : "Create entry"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}>
                  Reset form
                </Button>
              </div>
            </form>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10</CardTitle>
          </CardHeader>
          <CardContent>
            {top10.length ? (
              <RankedList
                key={top10.map((entry) => entry.id).join("-")}
                listKey="top10"
                entries={top10}
                editable
                onReorder={(ids) => persistRank("top10", ids)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No Top 10 entries yet.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {top5.length ? (
              <RankedList
                key={top5.map((entry) => entry.id).join("-")}
                listKey="top5"
                entries={top5}
                editable
                onReorder={(ids) => persistRank("top5", ids)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No Top 5 recommendations yet.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-2xl border border-black/10 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{entry.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.status.toLowerCase()} • {entry.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setForm(toForm(entry))}>
                      Edit
                    </Button>
                    <Button type="button" variant="outline" onClick={() => handleDelete(entry.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
