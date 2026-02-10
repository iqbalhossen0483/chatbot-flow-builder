import ToggleButton from "@/components/libs/ToggleButton";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Columns3Cog, Plus, X } from "lucide-react";
import { useCallback, useState } from "react";
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

// Shared input styles
const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all";

export default function SwitchNode({ id, data, selected }: SwitchNodeProps) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);

  const cases = data.cases ?? DEFAULT_CASES;
  const hasDefault = data.hasDefault ?? true;
  const allBranches = hasDefault
    ? [...cases, { id: "default", label: "Default", value: undefined }]
    : cases;

  const update = useCallback(
    (patch: Partial<SwitchNodeData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  );

  // Evenly space handles across the bottom
  const handlePositions = allBranches.map((_, i) => {
    const step = 100 / (allBranches.length + 1);
    return `${step * (i + 1)}%`;
  });

  // Case management functions
  const addCase = useCallback(() => {
    const newCase: SwitchCase = {
      id: `case-${Date.now()}`,
      label: `Case ${cases.length + 1}`,
      value: "",
    };
    update({ cases: [...cases, newCase] });
  }, [cases, update]);

  const removeCase = useCallback(
    (caseId: string) => {
      if (cases.length <= 1) return; // Keep at least 1 case
      update({ cases: cases.filter((c) => c.id !== caseId) });
    },
    [cases, update],
  );

  const updateCase = useCallback(
    (caseId: string, patch: Partial<SwitchCase>) => {
      update({
        cases: cases.map((c) => (c.id === caseId ? { ...c, ...patch } : c)),
      });
    },
    [cases, update],
  );

  // ── Collapsed preview ────────────────────────────────────────────────────
  const preview = (
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
          placeholder="Switch label…"
          className={inputCls}
        />
      </div>

      {/* Variable */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Variable to Switch On
        </label>
        <input
          type="text"
          value={data.variable ?? ""}
          onChange={(e) => update({ variable: e.target.value })}
          placeholder="e.g., user_choice, status"
          className={`${inputCls} font-mono`}
        />
      </div>

      {/* Cases */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Cases
          </label>
          <button
            onClick={addCase}
            className="flex items-center gap-1 text-[10px] font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            title="Add case"
          >
            <Plus size={12} />
            Add Case
          </button>
        </div>

        <div className="space-y-2">
          {cases.map((c, index) => (
            <div
              key={c.id}
              className={`rounded-lg p-2 space-y-1.5 border ${
                CASE_COLORS[index % CASE_COLORS.length]
              }`}
            >
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={c.label}
                  onChange={(e) => updateCase(c.id, { label: e.target.value })}
                  placeholder="Case label"
                  className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
                />
                {cases.length > 1 && (
                  <button
                    onClick={() => removeCase(c.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove case"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={c.value ?? ""}
                onChange={(e) => updateCase(c.id, { value: e.target.value })}
                placeholder="Match value (e.g., 'yes', '1', 'active')"
                className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Default branch toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Include Default Branch
          </span>
          <button
            onClick={() => update({ hasDefault: !hasDefault })}
            className={[
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
              hasDefault ? "bg-purple-500" : "bg-gray-200",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                hasDefault ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </label>
        <p className="text-[10px] text-gray-400 mt-1">
          Default branch handles all values not matched by cases
        </p>
      </div>
    </div>
  );

  return (
    <BaseNode selected={selected} hideDefaultHandles>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center shrink-0">
          <Columns3Cog size={16} className="text-purple-500" />
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Switch
        </span>
        <span className="ml-auto inline-flex items-center rounded-full bg-purple-50 px-1.5 py-0.5 text-xs font-medium text-purple-500 border border-purple-100">
          {cases.length} case{cases.length !== 1 ? "s" : ""}
        </span>
        <ToggleButton editing={editing} setEditing={setEditing} />
      </div>

      {editing ? editPanel : preview}

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
