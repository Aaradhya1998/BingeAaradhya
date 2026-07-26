import { PublicEntriesClient } from "@/components/PublicEntriesClient";

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Watched Library</h1>
        <p className="text-muted-foreground">
          Full archive with filterable categories, ratings, and notes.
        </p>
      </div>
      <PublicEntriesClient status="WATCHED" />
    </div>
  );
}
