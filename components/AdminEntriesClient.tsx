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
  posterUrl: string;
  backdropUrl: string;
  tmdbId: string;
  tmdbType: string;
  progressText: string;
  unitsConsumed: string;
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
  posterUrl: "",
  backdropUrl: "",
  tmdbId: "",
  tmdbType: "",
  progressText: "",
  unitsConsumed: "1",
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
    posterUrl: entry.posterUrl ?? "",
    backdropUrl: entry.backdropUrl ?? "",
    tmdbId: entry.tmdbId?.toString() ?? "",
    tmdbType: entry.tmdbType ?? "",
    progressText: entry.progressText ?? "",
    unitsConsumed: String(entry.unitsConsumed ?? 1),
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
    posterUrl: result.posterUrl ?? "",
    backdropUrl: result.backdropUrl ?? "",
    tmdbId: String(result.id),
    tmdbType: result.mediaType,
  };
}

function normalizePayload(form: EntryForm) {
  return {
    ...form,
    genres: form.genres
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    rating: form.rating || null,
    tmdbId: form.tmdbId || null,
    progressText: form.progressText || null,
    unitsConsumed: form.unitsConsumed || "1",
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
                    className="rounded-2xl border border-white/10 bg-slate-800/80 p-3 text-left hover:bg-slate-800 transition-colors"
                    onClick={() => setForm(fromTmdb(result))}
                  >
                    <div className="font-medium text-white">{result.title}</div>
                    <div className="text-sm text-slate-400">
                      {result.releaseYear ? `${result.releaseYear} • ` : ""}{result.genres.join(", ")}
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required />
              <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Type e.g. Movie, TV" required />
              <Input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} placeholder="Genres, comma separated" />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as EntryForm["status"] })}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="WATCHLIST" className="text-slate-900 bg-white">Watchlist</option>
                <option value="WATCHING" className="text-slate-900 bg-white">Currently Watching</option>
                <option value="WATCHED" className="text-slate-900 bg-white">Watched</option>
                <option value="DROPPED" className="text-slate-900 bg-white">Dropped</option>
              </select>
              <Input value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="Rating /10" />
              <Input value={form.progressText} onChange={(e) => setForm({ ...form, progressText: e.target.value })} placeholder="Progress e.g. S2E4" />
              <Input value={form.unitsConsumed} onChange={(e) => setForm({ ...form, unitsConsumed: e.target.value })} placeholder="Episodes or view count" />
              
              {/* Watchlist Priority Dropdown */}
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="" className="text-slate-900 bg-white">Watchlist Priority (Optional)</option>
                <option value="1" className="text-slate-900 bg-white">Top</option>
                <option value="2" className="text-slate-900 bg-white">Medium</option>
                <option value="3" className="text-slate-900 bg-white">Bottom</option>
              </select>

              {/* Labeled Date Fields */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Date Started</label>
                <Input type="date" value={form.dateStarted} onChange={(e) => setForm({ ...form, dateStarted: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Date Completed / Watched</label>
                <Input type="date" value={form.dateWatched} onChange={(e) => setForm({ ...form, dateWatched: e.target.value })} />
              </div>

              <Input value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} placeholder="Poster URL" className="md:col-span-2" />
              <Textarea value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} placeholder="Synopsis" className="md:col-span-2" />
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Short note or thoughts" className="md:col-span-2" />
              
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input type="checkbox" checked={form.isTop10} onChange={(e) => setForm({ ...form, isTop10: e.target.checked })} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500" />
                Include in Top 10
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input type="checkbox" checked={form.isTop5Rec} onChange={(e) => setForm({ ...form, isTop5Rec: e.target.checked })} className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500" />
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
              <div key={entry.id} className="rounded-2xl border border-black/10 bg-white p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{entry.title}</p>
                    <p className="text-sm font-medium text-slate-600">
                      {entry.status.toLowerCase()} • {entry.type}
                      {entry.rating ? ` • ★ ${entry.rating.toFixed(1)}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-slate-900 font-medium" onClick={() => setForm(toForm(entry))}>
                      Edit
                    </Button>
                    <Button type="button" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-medium" onClick={() => handleDelete(entry.id)}>
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
