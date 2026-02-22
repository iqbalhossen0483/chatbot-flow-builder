import {
  getHistoryLength,
  getPersistedIndex,
  getSnapshotAt,
  pushSnapshot,
  setPersistedIndex,
} from "@/components/libs/flowDB";
import type { Edge, Node } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type Options = {
  debounceMs?: number;
};

export function useFlowHistory(
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  { debounceMs = 1500 }: Options = {},
) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [historyLength, setHistoryLength] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isRestoring, setIsRestoring] = useState(true);

  const indexRef = useRef(-1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore last state on mount
  useEffect(() => {
    (async () => {
      const [idx, len] = await Promise.all([
        getPersistedIndex(),
        getHistoryLength(),
      ]);

      if (idx >= 0 && len > 0) {
        const snapshot = await getSnapshotAt(idx);
        if (snapshot) {
          setNodes(snapshot.nodes);
          setEdges(snapshot.edges);
        }
        indexRef.current = idx;
        setCurrentIndex(idx);
        setHistoryLength(len);
      }

      setIsRestoring(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save
  const save = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setSaveStatus("saving");

      debounceTimer.current = setTimeout(async () => {
        try {
          const newIndex = await pushSnapshot(nodes, edges, indexRef.current);
          indexRef.current = newIndex;
          setCurrentIndex(newIndex);
          setHistoryLength(newIndex + 1);
          setSaveStatus("saved");
        } catch (err) {
          console.error("[flowDB] Save failed:", err);
          setSaveStatus("error");
        }
      }, debounceMs);
    },
    [debounceMs],
  );

  const undo = useCallback(async () => {
    if (indexRef.current <= 0) return;
    const prevIndex = indexRef.current - 1;

    const snapshot = await getSnapshotAt(prevIndex);
    if (!snapshot) return;

    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    await setPersistedIndex(prevIndex);

    indexRef.current = prevIndex;
    setCurrentIndex(prevIndex);
    setSaveStatus("saved");
  }, [setNodes, setEdges]);

  const redo = useCallback(async () => {
    const len = await getHistoryLength();
    if (indexRef.current >= len - 1) return;
    const nextIndex = indexRef.current + 1;

    const snapshot = await getSnapshotAt(nextIndex);
    if (!snapshot) return;

    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    await setPersistedIndex(nextIndex);

    indexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    setSaveStatus("saved");
  }, [setNodes, setEdges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
      if (mod && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return {
    save,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < historyLength - 1,
    saveStatus,
    isRestoring,
  };
}
