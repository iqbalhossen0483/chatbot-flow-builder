import type { Edge, Node } from "@xyflow/react";
import Dexie, { type Table } from "dexie";

export type FlowSnapshot = {
  id?: number; // auto-incremented primary key
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
};

export type FlowMeta = {
  key: string; // key is currentIndex
  value: number;
};

class FlowDatabase extends Dexie {
  history!: Table<FlowSnapshot, number>;
  meta!: Table<FlowMeta, string>;

  constructor() {
    super("flow-db");
    this.version(1).stores({
      history: "++id", // auto-increment id
      meta: "key", // "key" is the primary key
    });
  }
}

export const db = new FlowDatabase();

/** Push new snapshot; truncate any "future" snapshots beyond currentIndex. */
export async function pushSnapshot(
  nodes: Node[],
  edges: Edge[],
  currentIndex: number,
): Promise<number> {
  // Delete everything after currentIndex (the redo branch)
  const all = await db.history.toArray();
  const toDelete = all.slice(currentIndex + 1).map((s) => s.id!);
  if (toDelete.length > 0) await db.history.bulkDelete(toDelete);

  // Add new snapshot
  await db.history.add({ nodes, edges, timestamp: Date.now() });

  // New index = everything that remains
  const newIndex = (await db.history.count()) - 1;
  await db.meta.put({ key: "currentIndex", value: newIndex });

  return newIndex;
}

/** Get snapshot at a given array index position. */
export async function getSnapshotAt(
  index: number,
): Promise<FlowSnapshot | null> {
  const all = await db.history.toArray();
  return all[index] ?? null;
}

/** Total number of snapshots. */
export async function getHistoryLength(): Promise<number> {
  return db.history.count();
}

export async function getPersistedIndex(): Promise<number> {
  const row = await db.meta.get("currentIndex");
  return row?.value ?? -1;
}

export async function setPersistedIndex(index: number): Promise<void> {
  await db.meta.put({ key: "currentIndex", value: index });
}

/** Wipe everything — use for a "clear canvas" action. */
export async function clearHistory(): Promise<void> {
  await db.transaction("rw", db.history, db.meta, async () => {
    await db.history.clear();
    await db.meta.clear();
  });
}
