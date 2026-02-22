import { SaveStatus } from "@/hooks/useFlowHistory";
import {
  Check,
  CircleX,
  Redo,
  Save,
  Trash2,
  Undo,
  Workflow,
} from "lucide-react";
import React, { JSX } from "react";

const STATUS_LABEL: Record<SaveStatus, JSX.Element | null> = {
  idle: null,
  saving: (
    <>
      <Save size={16} />
      <p>Saving…</p>
    </>
  ),
  saved: (
    <>
      <Check size={16} className="text-green-600" />
      <p>Saved</p>
    </>
  ),
  error: (
    <>
      <CircleX size={16} className="text-red-500" />
      <p>Save failed</p>
    </>
  ),
};

type Props = {
  onUndo: () => Promise<void>;
  onRedo: () => Promise<void>;
  onClear: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: SaveStatus;
  onDuplicate: () => void;
  selectedNodesCount: number;
};

const Toolbar = ({
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
  saveStatus,
  selectedNodesCount,
  onDuplicate,
}: Props) => {
  const className =
    "rounded bg-white px-2 py-1 text-xs shadow disabled:opacity-40 hover:bg-gray-50 flex flex-col justify-center items-center gap-1";
  return (
    <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
      {selectedNodesCount > 0 && (
        <button
          onClick={onDuplicate}
          title="Duplicate (Ctrl+D)"
          className={className}
        >
          <p className="flex items-center gap-1">
            {selectedNodesCount} <Workflow size={16} />
          </p>{" "}
          <p>Duplicate</p>
        </button>
      )}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className={className}
      >
        <Undo size={16} /> Undo
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
        className={className}
      >
        <Redo size={16} /> Redo
      </button>
      <button onClick={onClear} title="Clear canvas" className={className}>
        <Trash2 size={16} /> Clear
      </button>
      {STATUS_LABEL[saveStatus] && (
        <span className="rounded bg-white/90 px-2 py-1 text-xs shadow flex flex-col justify-center items-center">
          {STATUS_LABEL[saveStatus]}
        </span>
      )}
    </div>
  );
};

export default Toolbar;
