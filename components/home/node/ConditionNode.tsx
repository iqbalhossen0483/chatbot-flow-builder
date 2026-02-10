import ToggleButton from "@/components/libs/ToggleButton";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { AirVent, Plus, X } from "lucide-react";
import { useCallback, useState } from "react";
import { BaseNode } from "./BaseNode";

type ConditionBranch = {
  id: string;
  label: string;
  condition: string;
};

type ConditionNodeData = {
  label: string;
  branches?: ConditionBranch[];
};

type ConditionNodeProps = {
  id: string;
  data: ConditionNodeData;
  selected?: boolean;
};

const DEFAULT_BRANCHES: ConditionBranch[] = [
  { id: "if", label: "If", condition: "" },
  { id: "else", label: "Else", condition: "" },
];

export default function ConditionNode({
  id,
  data,
  selected,
}: ConditionNodeProps) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);

  const branches = data.branches ?? DEFAULT_BRANCHES;

  const update = useCallback(
    (patch: Partial<ConditionNodeData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  );

  // Evenly space branch handles across the bottom
  const branchHandlePositions = branches.map((_, i) => {
    const step = 100 / (branches.length + 1);
    return `${step * (i + 1)}%`;
  });

  // Branch management functions
  const addElseIf = useCallback(() => {
    // Insert before the last branch (which should be "else")
    const newBranch: ConditionBranch = {
      id: `elseif_${Date.now()}`,
      label: "Else If",
      condition: "",
    };
    const newBranches = [...branches];
    newBranches.splice(branches.length - 1, 0, newBranch);
    update({ branches: newBranches });
  }, [branches, update]);

  const removeBranch = useCallback(
    (branchId: string) => {
      // Don't allow removing if only 2 branches left (if + else)
      if (branches.length <= 2) return;
      // Don't allow removing the last branch (else)
      if (branches[branches.length - 1].id === branchId) return;
      update({ branches: branches.filter((b) => b.id !== branchId) });
    },
    [branches, update],
  );

  const updateBranch = useCallback(
    (branchId: string, patch: Partial<ConditionBranch>) => {
      update({
        branches: branches.map((b) =>
          b.id === branchId ? { ...b, ...patch } : b,
        ),
      });
    },
    [branches, update],
  );

  const getBranchColor = (branch: ConditionBranch, index: number) => {
    const isLast = index === branches.length - 1;
    const isFirst = index === 0;

    if (isFirst) {
      return "bg-green-50 text-green-600 border-green-100";
    } else if (isLast) {
      return "bg-red-50 text-red-500 border-red-100";
    } else {
      return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  // ── Collapsed preview ────────────────────────────────────────────────────
  const preview = (
    <div className="space-y-1.5">
      <div className="text-sm text-gray-800 font-medium truncate max-w-50">
        {data.label || "Untitled condition"}
      </div>

      {/* Branch list */}
      <div className="flex flex-wrap gap-1 pt-1">
        {branches.map((branch, index) => (
          <span
            key={branch.id}
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getBranchColor(branch, index)}`}
          >
            {branch.label}
          </span>
        ))}
      </div>

      {/* Show conditions preview */}
      {branches.some((b) => b.condition) && (
        <div className="text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5 truncate max-w-50">
          {branches
            .filter((b) => b.condition)
            .map((b) => b.condition)
            .join(" | ")}
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
          placeholder="Condition label…"
        />
      </div>

      {/* Branches */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Branches
          </label>
          <button
            onClick={addElseIf}
            className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            title="Add Else If"
          >
            <Plus size={12} />
            Else If
          </button>
        </div>

        <div className="space-y-2">
          {branches.map((branch, index) => {
            const isLast = index === branches.length - 1;
            const isFirst = index === 0;

            return (
              <div
                key={branch.id}
                className={`rounded-lg p-2 space-y-1.5 ${
                  isFirst
                    ? "bg-green-50 border border-green-100"
                    : isLast
                      ? "bg-red-50 border border-red-100"
                      : "bg-blue-50 border border-blue-100"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={branch.label}
                    onChange={(e) =>
                      updateBranch(branch.id, { label: e.target.value })
                    }
                    placeholder={isFirst ? "If" : isLast ? "Else" : "Else If"}
                    className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                  />
                  {!isFirst && !isLast && (
                    <button
                      onClick={() => removeBranch(branch.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove Else If"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Condition input (not for the final "else" branch) */}
                {!isLast && (
                  <input
                    type="text"
                    value={branch.condition ?? ""}
                    onChange={(e) =>
                      updateBranch(branch.id, { condition: e.target.value })
                    }
                    placeholder="e.g., age >= 18, status == 'active'"
                    className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 font-mono"
                  />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-gray-400 mt-2">
          Branches are evaluated in order. The &quot;Else&quot; branch catches
          all other cases.
        </p>
      </div>
    </div>
  );

  return (
    <BaseNode selected={selected} hideDefaultHandles>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
          <AirVent size={16} className="text-amber-500" />
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Condition
        </span>
        <ToggleButton editing={editing} setEditing={setEditing} />
      </div>

      {editing ? editPanel : preview}

      {/* Single target on top */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3! h-3! bg-white! border-2! border-amber-400!"
      />

      {/* One source handle per branch along the bottom */}
      {branches.map((branch, i) => (
        <Handle
          key={branch.id}
          id={branch.id}
          type="source"
          position={Position.Bottom}
          style={{ left: branchHandlePositions[i] }}
          className="w-3! h-3! bg-white! border-2! border-amber-400!"
          title={branch.label}
        />
      ))}
    </BaseNode>
  );
}
