import ToggleButton from "@/components/libs/ToggleButton";
import { Handle, Position, useNodes, useReactFlow } from "@xyflow/react";
import { ArrowRightLeftIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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

export default function JumpNode({ id, data, selected }: JumpNodeProps) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const nodes = useNodes();

  const hasTarget = !!data.targetNodeId;

  const update = useCallback(
    (patch: Partial<JumpNodeData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  );

  // Get all available target nodes (excluding this node)
  const availableTargets = useMemo(() => {
    return nodes.filter((node) => node.id !== id);
  }, [nodes, id]);

  const handleTargetChange = useCallback(
    (targetId: string) => {
      if (!targetId) {
        update({ targetNodeId: undefined, targetNodeLabel: undefined });
        return;
      }

      const targetNode = nodes.find((n) => n.id === targetId);
      const targetLabel = targetNode?.data?.label;
      update({
        targetNodeId: targetId,
        targetNodeLabel:
          typeof targetLabel === "string" ? targetLabel : targetId,
      });
    },
    [nodes, update],
  );

  // ── Collapsed preview ────────────────────────────────────────────────────
  const preview = (
    <div className="space-y-1.5">
      <div className="text-sm text-gray-800 font-medium truncate max-w-45">
        {data.label || "Untitled jump"}
      </div>

      {hasTarget ? (
        <div className="flex items-center gap-1 text-xs text-gray-500 bg-pink-50 border border-pink-100 rounded-md px-2 py-1">
          <svg
            className="size-3 text-pink-400 shrink-0"
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
  );

  // ── Edit panel ────────────────────────────────────────────────────────────
  const editPanel = (
    <div className="mt-3 space-y-3 nodrag nopan nowheel">
      {/* Label */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Label
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Jump label…"
        />
      </div>

      {/* Target Node Selector */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Jump to Node
        </label>
        <select
          value={data.targetNodeId ?? ""}
          onChange={(e) => handleTargetChange(e.target.value)}
          className="font-mono cursor-pointer"
        >
          <option value="">-- Select target node --</option>
          {availableTargets.map((node) => {
            const nodeLabel = node.data?.label;
            return (
              <option key={node.id} value={node.id}>
                {typeof nodeLabel === "string" ? nodeLabel : node.id}
              </option>
            );
          })}
        </select>
        {availableTargets.length === 0 && (
          <p className="text-[10px] text-gray-400 mt-1">
            No other nodes available to jump to
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Description
        </label>
        <textarea
          value={data.description ?? ""}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Optional note about this jump…"
          rows={2}
          className="resize-none"
        />
      </div>
    </div>
  );

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="size-6 rounded-md bg-pink-50 flex items-center justify-center shrink-0">
          <ArrowRightLeftIcon size={16} className="text-pink-500" />
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Jump
        </span>
        {hasTarget && (
          <span className="ml-auto inline-flex items-center rounded-full bg-pink-50 px-1.5 py-0.5 text-xs font-medium text-pink-500 border border-pink-100">
            Linked
          </span>
        )}
        <ToggleButton editing={editing} setEditing={setEditing} />
      </div>

      {editing ? editPanel : preview}

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
