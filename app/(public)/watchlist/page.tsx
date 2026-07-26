import { PublicEntriesClient } from "@/components/PublicEntriesClient";

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Future Shows</h1>
        <p className="text-muted-foreground">
          Everything queued up next, sortable and ready to be promoted into progress.
        </p>
      </div>
      <PublicEntriesClient status="WATCHLIST" />
    </div>
  );
}
