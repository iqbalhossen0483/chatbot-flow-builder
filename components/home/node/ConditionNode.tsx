import ToggleButton from "@/components/libs/ToggleButton";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { AirVent, Plus, X } from "lucide-react";
import { useCallback, useState } from "react";
import { BaseNode } from "./BaseNode";

type ConditionBranch = {
  id: string;
  label: string;
  expression?: string;
};

type ConditionNodeData = {
  label: string;
  mode?: "if_else" | "switch";
  variable?: string;
  branches?: ConditionBranch[];
};

type ConditionNodeProps = {
  id: string;
  data: ConditionNodeData;
  selected?: boolean;
};

const DEFAULT_IF_ELSE_BRANCHES: ConditionBranch[] = [
  { id: "true", label: "True", expression: "" },
  { id: "false", label: "False", expression: "" },
];

export default function ConditionNode({
  id,
  data,
  selected,
}: ConditionNodeProps) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);

  const mode = data.mode ?? "if_else";
  const branches = data.branches ?? DEFAULT_IF_ELSE_BRANCHES;

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
  const addBranch = useCallback(() => {
    const newBranch: ConditionBranch = {
      id: `branch_${Date.now()}`,
      label: `Branch ${branches.length + 1}`,
      expression: "",
    };
    update({ branches: [...branches, newBranch] });
  }, [branches, update]);

  const removeBranch = useCallback(
    (branchId: string) => {
      if (branches.length <= 2) return; // Keep at least 2 branches
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

  // ── Collapsed preview
  const preview = (
    <div className="space-y-1.5">
      <div className="text-sm text-gray-800 font-medium truncate max-w-50">
        {data.label || "Untitled condition"}
      </div>

      {data.variable && (
        <div className="text-xs text-gray-400 font-mono bg-gray-50 rounded px-1.5 py-0.5 truncate max-w-50">
          eval: {data.variable}
        </div>
      )}

      {/* Branch list */}
      <div className="flex flex-wrap gap-1 pt-1">
        {branches.map((branch) => (
          <span
            key={branch.id}
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
              branch.id === "true" || branch.label.toLowerCase() === "true"
                ? "bg-green-50 text-green-600 border-green-100"
                : branch.id === "false" ||
                    branch.label.toLowerCase() === "false"
                  ? "bg-red-50 text-red-500 border-red-100"
                  : "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            {branch.label}
          </span>
        ))}
      </div>
    </div>
  );

  // ── Edit panel
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

      {/* Mode selector */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Mode
        </label>
        <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-0.5">
          {(["if_else", "switch"] as const).map((m) => (
            <button
              key={m}
              onClick={() => update({ mode: m })}
              className={[
                "rounded-md py-1.5 px-2 text-[10px] font-semibold transition-all duration-150",
                mode === m
                  ? "bg-white text-amber-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              ].join(" ")}
            >
              {m === "if_else" ? "IF / ELSE" : "SWITCH"}
            </button>
          ))}
        </div>
      </div>

      {/* Variable */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Variable to Evaluate
        </label>
        <input
          type="text"
          value={data.variable ?? ""}
          onChange={(e) => update({ variable: e.target.value })}
          placeholder="e.g., user_response"
          className="font-mono"
        />
      </div>

      {/* Branches */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Branches
          </label>
          <button
            onClick={addBranch}
            className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            title="Add branch"
          >
            <Plus size={12} />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {branches.map((branch, index) => (
            <div
              key={branch.id}
              className="bg-gray-50 rounded-lg p-2 space-y-1.5"
            >
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={branch.label}
                  onChange={(e) =>
                    updateBranch(branch.id, { label: e.target.value })
                  }
                  placeholder="Branch label"
                  className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                />
                {branches.length > 2 && (
                  <button
                    onClick={() => removeBranch(branch.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove branch"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {mode === "switch" && (
                <input
                  type="text"
                  value={branch.expression ?? ""}
                  onChange={(e) =>
                    updateBranch(branch.id, { expression: e.target.value })
                  }
                  placeholder="Match value (e.g., 'yes', '> 100')"
                  className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 font-mono"
                />
              )}
            </div>
          ))}
        </div>
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
        <span className="ml-auto inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-600 border border-amber-100">
          {mode === "if_else" ? "IF / ELSE" : "SWITCH"}
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
