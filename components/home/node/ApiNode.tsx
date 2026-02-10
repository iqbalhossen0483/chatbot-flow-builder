import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

type ApiNodeData = {
  label: string;
  url?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  mock?: boolean;
  mockStatusCode?: number;
  headers?: Record<string, string>;
  bodyPreview?: string;
};

type ApiNodeProps = {
  id: string;
  data: ApiNodeData;
  selected?: boolean;
};

const METHOD_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  GET: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  POST: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  PUT: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  PATCH: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
  },
  DELETE: { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" },
};

export default function ApiNode({ data, selected }: ApiNodeProps) {
  const method = data.method ?? "GET";
  const colors = METHOD_COLORS[method] ?? METHOD_COLORS.GET;
  const isMock = data.mock ?? false;

  // Truncate URL for display
  const displayUrl = data.url
    ? data.url.replace(/^https?:\/\//, "").slice(0, 30) +
      (data.url.length > 35 ? "…" : "")
    : "No URL set";

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
          <svg
            className="w-3.5 h-3.5 text-violet-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 20V10" />
            <path d="M12 20V4" />
            <path d="M6 20v-6" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          API Call
        </span>
        {isMock && (
          <span className="ml-auto inline-flex items-center rounded-full bg-yellow-50 px-1.5 py-0.5 text-xs font-medium text-yellow-600 border border-yellow-100">
            MOCK
          </span>
        )}
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <div className="text-sm text-gray-800 font-medium truncate max-w-45">
          {data.label || "Untitled request"}
        </div>

        {/* Method + URL */}
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-mono font-bold border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {method}
          </span>
          <span className="text-xs text-gray-400 font-mono truncate max-w-32.5">
            {displayUrl}
          </span>
        </div>

        {/* Mock status code */}
        {isMock && data.mockStatusCode && (
          <div className="text-xs text-gray-400 font-mono bg-gray-50 rounded px-1.5 py-0.5">
            → {data.mockStatusCode}{" "}
            {data.mockStatusCode < 300
              ? "OK"
              : data.mockStatusCode < 400
                ? "Redirect"
                : "Error"}
          </div>
        )}

        {/* Body preview */}
        {data.bodyPreview && (
          <div className="text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5 truncate max-w-45 font-mono">
            {data.bodyPreview}
          </div>
        )}
      </div>

      {/* Success / failure handles at bottom */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3! h-3! bg-white! border-2! border-violet-400!"
      />
      {/* Success */}
      <Handle
        id="success"
        type="source"
        position={Position.Bottom}
        style={{ left: "30%" }}
        className="w-3! h-3! bg-white! border-2! border-emerald-400!"
        title="Success"
      />
      {/* Failure */}
      <Handle
        id="failure"
        type="source"
        position={Position.Bottom}
        style={{ left: "70%" }}
        className="w-3! h-3! bg-white! border-2! border-red-400!"
        title="Failure"
      />
    </BaseNode>
  );
}
