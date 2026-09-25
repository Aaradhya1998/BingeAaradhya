import { PublicEntriesClient } from "@/components/PublicEntriesClient";
import { Film } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Film className="h-6 w-6 text-[#f5a623]" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Watched Library
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          A complete, filterable archive of completed cinema and series with personal ratings.
        </p>
      </div>
      <PublicEntriesClient status="WATCHED" />
    </div>
  );
}
