import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

type JumpNodeData = {
  label: string;
  targetNodeId?: string;
  targetNodeLabel?: string;
  description?: string;
};

type JumpNodeProps = {
  id: string;
  data: JumpNodeData;
  selected?: boolean;
};

export default function JumpNode({ data, selected }: JumpNodeProps) {
  const hasTarget = !!data.targetNodeId;

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-pink-50 flex items-center justify-center shrink-0">
          <svg
            className="w-3.5 h-3.5 text-pink-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 10 20 15 15 20" />
            <path d="M4 4v7a4 4 0 0 0 4 4h12" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Jump
        </span>
        {hasTarget && (
          <span className="ml-auto inline-flex items-center rounded-full bg-pink-50 px-1.5 py-0.5 text-xs font-medium text-pink-500 border border-pink-100">
            Linked
          </span>
        )}
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <div className="text-sm text-gray-800 font-medium truncate max-w-45">
          {data.label || "Untitled jump"}
        </div>

        {hasTarget ? (
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-pink-50 border border-pink-100 rounded-md px-2 py-1">
            <svg
              className="w-3 h-3 text-pink-400 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="truncate max-w-35 font-mono">
              {data.targetNodeLabel ?? data.targetNodeId}
            </span>
          </div>
        ) : (
          <div className="text-xs text-gray-400">No target selected</div>
        )}

        {data.description && (
          <div className="text-xs text-gray-400 truncate max-w-45">
            {data.description}
          </div>
        )}
      </div>

      {/* Jump only has a target handle — it redirects flow, not continues linearly */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3! h-3! bg-white! border-2! border-pink-400!"
      />
      {/* Source handle: optional — useful if jump is conditional */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3! h-3! bg-white! border-2! border-pink-400!"
      />
    </BaseNode>
  );
}
