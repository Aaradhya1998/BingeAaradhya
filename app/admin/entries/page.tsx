export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { AdminEntriesClient } from "@/components/AdminEntriesClient";

export default async function AdminEntriesPage() {
  await requireAdminSession();

  const entries = await prisma.entry.findMany({
    orderBy: [{ updatedAt: "desc" }, { dateAdded: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Admin Entries</h1>
        <p className="text-muted-foreground">
          Create, edit, reorder, and transition entries between watchlist, watching, and watched.
        </p>
      </div>
      <AdminEntriesClient initialEntries={entries} />
    </div>
  );
}
