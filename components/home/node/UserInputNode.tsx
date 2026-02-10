import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

type UserInputNodeData = {
  label: string;
  placeholder?: string;
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

export default function UserInputNode({ data, selected }: UserInputNodeProps) {
  const inputType = data.inputType ?? "text";

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
          <svg
            className="w-3.5 h-3.5 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          User Input
        </span>
      </div>

      {/* Body */}
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
          <div className="text-xs text-gray-400 truncate max-w-45">
            {data.placeholder}
          </div>
        )}
      </div>

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
