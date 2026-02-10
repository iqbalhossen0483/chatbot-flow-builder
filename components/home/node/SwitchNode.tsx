import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

type SwitchCase = {
  id: string;
  label: string;
  value?: string;
};

type SwitchNodeData = {
  label: string;
  variable?: string;
  cases?: SwitchCase[];
  hasDefault?: boolean;
};

type SwitchNodeProps = {
  id: string;
  data: SwitchNodeData;
  selected?: boolean;
};

const DEFAULT_CASES: SwitchCase[] = [
  { id: "case-1", label: "Case 1", value: "value_1" },
  { id: "case-2", label: "Case 2", value: "value_2" },
  { id: "case-3", label: "Case 3", value: "value_3" },
];

const CASE_COLORS = [
  "bg-violet-50 text-violet-600 border-violet-100",
  "bg-blue-50 text-blue-600 border-blue-100",
  "bg-cyan-50 text-cyan-600 border-cyan-100",
  "bg-teal-50 text-teal-600 border-teal-100",
  "bg-emerald-50 text-emerald-600 border-emerald-100",
  "bg-orange-50 text-orange-600 border-orange-100",
];

export default function SwitchNode({ data, selected }: SwitchNodeProps) {
  const cases = data.cases ?? DEFAULT_CASES;
  const hasDefault = data.hasDefault ?? true;
  const allBranches = hasDefault
    ? [...cases, { id: "default", label: "Default", value: undefined }]
    : cases;

  // Evenly space handles across the bottom
  const handlePositions = allBranches.map((_, i) => {
    const step = 100 / (allBranches.length + 1);
    return `${step * (i + 1)}%`;
  });

  return (
    <BaseNode selected={selected} hideDefaultHandles>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center shrink-0">
          <svg
            className="w-3.5 h-3.5 text-purple-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 6h13" />
            <path d="M8 12h13" />
            <path d="M8 18h13" />
            <path d="M3 6h.01" />
            <path d="M3 12h.01" />
            <path d="M3 18h.01" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Switch
        </span>
        <span className="ml-auto inline-flex items-center rounded-full bg-purple-50 px-1.5 py-0.5 text-xs font-medium text-purple-500 border border-purple-100">
          {cases.length} case{cases.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Variable being switched on */}
      <div className="space-y-2">
        <div className="text-sm text-gray-800 font-medium truncate max-w-50">
          {data.label || "Untitled switch"}
        </div>

        {data.variable && (
          <div className="text-xs text-gray-400 font-mono bg-gray-50 rounded px-1.5 py-0.5 truncate max-w-50">
            switch ({data.variable})
          </div>
        )}

        {/* Case list */}
        <div className="flex flex-col gap-1 pt-0.5">
          {cases.map((c, i) => (
            <div key={c.id} className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium border ${
                  CASE_COLORS[i % CASE_COLORS.length]
                }`}
              >
                {c.label}
              </span>
              {c.value !== undefined && (
                <span className="text-xs text-gray-400 font-mono truncate max-w-30">
                  = {c.value}
                </span>
              )}
            </div>
          ))}

          {/* Default branch */}
          {hasDefault && (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium border bg-gray-50 text-gray-500 border-gray-200">
                Default
              </span>
              <span className="text-xs text-gray-300 italic">fallback</span>
            </div>
          )}
        </div>
      </div>

      {/* Single target on top */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3! h-3! bg-white! border-2! border-purple-400!"
      />

      {/* One source handle per branch along the bottom */}
      {allBranches.map((branch, i) => (
        <Handle
          key={branch.id}
          id={branch.id}
          type="source"
          position={Position.Bottom}
          style={{ left: handlePositions[i] }}
          className={`w-3! h-3! bg-white! border-2! ${
            branch.id === "default" ? "border-gray-400!" : "border-purple-400!"
          }`}
          title={branch.label}
        />
      ))}
    </BaseNode>
  );
}
