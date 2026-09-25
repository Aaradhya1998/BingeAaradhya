"use client";

import { useMemo, useState } from "react";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical, Star } from "lucide-react";

import type { EntryRecord } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";

function SortableRow({
  entry,
  index,
  editable,
}: {
  entry: EntryRecord;
  index: number;
  editable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: entry.id,
    disabled: !editable,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="glass-card flex items-center gap-4 p-3 sm:p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5a623] text-xs font-bold text-slate-950 shadow-[0_0_12px_rgba(245,166,35,0.4)]">
          #{index + 1}
        </div>
        {editable ? (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab rounded-full border border-white/10 p-1.5 text-slate-400 hover:border-white/30 hover:bg-white/10 hover:text-white"
            aria-label={`Reorder ${entry.title}`}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-800">
        {entry.posterUrl ? (
          <Image src={entry.posterUrl} alt={entry.title} fill className="object-cover" sizes="80px" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-white truncate">{entry.title}</p>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300">
            {entry.type}
          </span>
        </div>
        <p className="truncate text-xs text-slate-400 mt-1">
          {entry.notes || entry.synopsis || "Personal favorite."}
        </p>
      </div>
      {typeof entry.rating === "number" && (
        <div className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-[#f5a623] border border-white/10">
          <Star className="h-3.5 w-3.5 fill-[#f5a623]" />
          <span>{entry.rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}

export function RankedList({
  entries,
  editable = false,
  listKey,
  onReorder,
  viewMode,
}: {
  entries: EntryRecord[];
  editable?: boolean;
  listKey: "top10" | "top5";
  onReorder?: (ids: string[]) => Promise<void> | void;
  viewMode?: "grid" | "list";
}) {
  const [items, setItems] = useState(entries);
  const ids = useMemo(() => items.map((entry) => entry.id), [items]);

  const effectiveMode = viewMode ?? (editable ? "list" : "grid");

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    await onReorder?.(next.map((entry) => entry.id));
  }

  // 6-column Grid Mode (Flix-id style)
  if (effectiveMode === "grid" && !editable) {
    return (
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((entry, index) => (
          <EntryCard
            key={`${listKey}-${entry.id}`}
            entry={entry}
            rank={index + 1}
          />
        ))}
      </div>
    );
  }

  // List Mode (for admin or compact view)
  return (
    <DndContext id={`${listKey}-dnd`} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5">
          {items.map((entry, index) => (
            <SortableRow
              key={`${listKey}-${entry.id}`}
              entry={entry}
              index={index}
              editable={editable}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
