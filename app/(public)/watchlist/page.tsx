import { PublicEntriesClient } from "@/components/PublicEntriesClient";
import { Clock } from "lucide-react";

export default function WatchlistPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-[#f5a623]" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Watchlist
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          Everything queued up next, prioritized and ready to be binged.
        </p>
      </div>
      <PublicEntriesClient status="WATCHLIST" />
    </div>
  );
}
