import Switch from "@/components/libs/Switch";
import ToggleButton from "@/components/libs/ToggleButton";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { FilePenLine } from "lucide-react";
import { useCallback, useState } from "react";
import { BaseNode } from "./BaseNode";

type UserInputNodeData = {
  label: string;
  placeholder?: string;
  userInput: string;
  inputType?: "text" | "number" | "email" | "phone" | "date";
  required?: boolean;
  variableName?: string;
};

type UserInputNodeProps = {
  id: string;
  data: UserInputNodeData;
  selected?: boolean;
};

const INPUT_TYPE_LABELS: Record<string, string> = {
  text: "Text",
  number: "Number",
  email: "Email",
  phone: "Phone",
  date: "Date",
};

const ALL_INPUT_TYPES: Array<"text" | "number" | "email" | "phone" | "date"> = [
  "text",
  "number",
  "email",
  "phone",
  "date",
];

export default function UserInputNode({
  id,
  data,
  selected,
}: UserInputNodeProps) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);

  const inputType = data.inputType ?? "text";

  const update = useCallback(
    (patch: Partial<UserInputNodeData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  );

  // ── Collapsed preview ────────────────────────────────────────────────────
  const preview = (
    <div className="space-y-1.5">
      <div className="text-sm text-gray-800 font-medium truncate max-w-45">
        {data.label || "Untitled input"}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 border border-blue-100">
          {INPUT_TYPE_LABELS[inputType]}
        </span>
        {data.required && (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500 border border-red-100">
            Required
          </span>
        )}
      </div>

      {data.variableName && (
        <div className="text-xs text-gray-400 font-mono bg-gray-50 rounded px-1.5 py-0.5 truncate max-w-45">
          → {data.variableName}
        </div>
      )}

      {data.placeholder && (
        <input
          type={inputType}
          placeholder={data.placeholder}
          value={data.userInput}
          onChange={(e) => update({ userInput: e.target.value })}
        />
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
          placeholder="Input field label…"
        />
      </div>

      {/* Input Type */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Input Type
        </label>
        <div className="grid grid-cols-5 gap-1 bg-gray-100 rounded-lg p-0.5">
          {ALL_INPUT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => update({ inputType: t })}
              title={INPUT_TYPE_LABELS[t]}
              className={[
                "flex items-center justify-center rounded-md py-1.5 px-1 text-[9px] font-semibold transition-all duration-150",
                inputType === t
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              ].join(" ")}
            >
              {INPUT_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Variable Name */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Variable Name
        </label>
        <input
          type="text"
          value={data.variableName ?? ""}
          onChange={(e) => update({ variableName: e.target.value })}
          placeholder="e.g., user_email"
          className="font-mono"
        />
      </div>

      {/* Placeholder */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Placeholder
        </label>
        <input
          type="text"
          value={data.placeholder ?? ""}
          onChange={(e) => update({ placeholder: e.target.value })}
          placeholder="Enter placeholder text…"
        />
      </div>

      {/* Required Toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Required Field
          </span>
          <Switch
            value={data.required ?? false}
            onChange={(value) => update({ required: value })}
          />
        </label>
      </div>
    </div>
  );

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
          <FilePenLine size={16} className="text-blue-500" />
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          User Input
        </span>
        <ToggleButton editing={editing} setEditing={setEditing} />
      </div>

      {editing ? editPanel : preview}

      <Handle
        type="target"
        position={Position.Top}
        className="w-3! h-3! bg-white! border-2! border-blue-400!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3! h-3! bg-white! border-2! border-blue-400!"
      />
    </BaseNode>
  );
}
