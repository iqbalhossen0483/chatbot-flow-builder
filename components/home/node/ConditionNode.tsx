import { Handle, Position } from "@xyflow/react";
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

export default function ConditionNode({ data, selected }: ConditionNodeProps) {
  const mode = data.mode ?? "if_else";
  const branches = data.branches ?? DEFAULT_IF_ELSE_BRANCHES;

  // Evenly space branch handles across the bottom
  const branchHandlePositions = branches.map((_, i) => {
    const step = 100 / (branches.length + 1);
    return `${step * (i + 1)}%`;
  });

  return (
    <BaseNode selected={selected} hideDefaultHandles>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
          <svg
            className="w-3.5 h-3.5 text-amber-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 12H2" />
            <path d="M12 2v10" />
            <path d="m6 16 6 6 6-6" />
            <path d="m6 8-6-6 6-6" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Condition
        </span>
        <span className="ml-auto inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-600 border border-amber-100">
          {mode === "if_else" ? "IF / ELSE" : "SWITCH"}
        </span>
      </div>

      {/* Variable being evaluated */}
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
