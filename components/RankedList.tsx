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
import { GripVertical } from "lucide-react";

import type { EntryRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

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
      className="surface flex items-center gap-4 p-3"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {index + 1}
        </div>
        {editable ? (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="rounded-full border border-black/10 p-2"
            aria-label={`Reorder ${entry.title}`}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="relative h-20 w-14 overflow-hidden rounded-xl bg-muted">
        {entry.posterUrl ? (
          <Image src={entry.posterUrl} alt={entry.title} fill className="object-cover" sizes="80px" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{entry.title}</p>
          <Badge>{entry.type}</Badge>
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {entry.notes || entry.synopsis || "Personal favorite."}
        </p>
      </div>
      {typeof entry.rating === "number" ? <p className="text-sm">{entry.rating}/10</p> : null}
    </div>
  );
}

export function RankedList({
  entries,
  editable = false,
  listKey,
  onReorder,
}: {
  entries: EntryRecord[];
  editable?: boolean;
  listKey: "top10" | "top5";
  onReorder?: (ids: string[]) => Promise<void> | void;
}) {
  const [items, setItems] = useState(entries);

  const ids = useMemo(() => items.map((entry) => entry.id), [items]);

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

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
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
