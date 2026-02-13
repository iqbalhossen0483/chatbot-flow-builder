import ToggleButton from "@/components/libs/ToggleButton";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { ArrowBigUp, Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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

const ALL_METHODS: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE"> = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

export default function ApiNode({ id, data, selected }: ApiNodeProps) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);

  const method = data.method ?? "GET";
  const colors = METHOD_COLORS[method] ?? METHOD_COLORS.GET;
  const isMock = data.mock ?? false;
  const headers = useMemo(() => data.headers ?? {}, [data.headers]);

  const update = useCallback(
    (patch: Partial<ApiNodeData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  );

  // Truncate URL for display
  const displayUrl = data.url
    ? data.url.replace(/^https?:\/\//, "").slice(0, 30) +
      (data.url.length > 35 ? "…" : "")
    : "No URL set";

  // Header management
  const addHeader = useCallback(() => {
    const newHeaders = { ...headers, "": "" };
    update({ headers: newHeaders });
  }, [headers, update]);

  const updateHeader = useCallback(
    (oldKey: string, newKey: string, value: string) => {
      const newHeaders = { ...headers };
      if (oldKey !== newKey && oldKey in newHeaders) {
        delete newHeaders[oldKey];
      }
      if (newKey.trim()) {
        newHeaders[newKey] = value;
      }
      update({ headers: newHeaders });
    },
    [headers, update],
  );

  const removeHeader = useCallback(
    (key: string) => {
      const newHeaders = { ...headers };
      delete newHeaders[key];
      update({ headers: newHeaders });
    },
    [headers, update],
  );

  // ── Collapsed preview ────────────────────────────────────────────────────
  const preview = (
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
          placeholder="API request label…"
        />
      </div>

      {/* Method selector */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          HTTP Method
        </label>
        <div className="grid grid-cols-5 gap-1 bg-gray-100 rounded-lg p-0.5">
          {ALL_METHODS.map((m) => {
            const c = METHOD_COLORS[m];
            return (
              <button
                key={m}
                onClick={() => update({ method: m })}
                title={m}
                className={[
                  "rounded-md py-1.5 px-1 text-[9px] font-bold font-mono transition-all duration-150",
                  method === m
                    ? `bg-white shadow-sm ${c.text}`
                    : "text-gray-400 hover:text-gray-600",
                ].join(" ")}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* URL */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Endpoint URL
        </label>
        <input
          type="url"
          value={data.url ?? ""}
          onChange={(e) => update({ url: e.target.value })}
          placeholder="https://api.example.com/endpoint"
          className="font-mono"
        />
      </div>

      {/* Request Body (for POST, PUT, PATCH) */}
      {(method === "POST" || method === "PUT" || method === "PATCH") && (
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Request Body
          </label>
          <textarea
            value={data.bodyPreview ?? ""}
            onChange={(e) => update({ bodyPreview: e.target.value })}
            placeholder='{"key": "value"}'
            rows={3}
            className="resize-none font-mono"
          />
        </div>
      )}

      {/* Headers */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Headers
          </label>
          <button
            onClick={addHeader}
            className="flex items-center gap-1 text-[10px] font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            title="Add header"
          >
            <Plus size={12} />
            Add
          </button>
        </div>

        <div className="space-y-1.5">
          {Object.entries(headers).map(([key, value], index) => (
            <div key={index} className="flex items-center gap-1.5">
              <input
                type="text"
                value={key}
                onChange={(e) => updateHeader(key, e.target.value, value)}
                placeholder="Header-Name"
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 font-mono"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateHeader(key, key, e.target.value)}
                placeholder="value"
                className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-800 placeholder-gray-300 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 font-mono"
              />
              <button
                onClick={() => removeHeader(key)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove header"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {Object.keys(headers).length === 0 && (
            <p className="text-xs text-gray-400 italic">No headers added</p>
          )}
        </div>
      </div>

      {/* Mock toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Mock Response
          </span>
          <button
            onClick={() => update({ mock: !isMock })}
            className={[
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
              isMock ? "bg-yellow-500" : "bg-gray-200",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                isMock ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </label>
        <p className="text-[10px] text-gray-400 mt-1">
          Use mock data instead of real API call
        </p>
      </div>

      {/* Mock status code (only if mock enabled) */}
      {isMock && (
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Mock Status Code
          </label>
          <input
            type="number"
            value={data.mockStatusCode ?? 200}
            onChange={(e) =>
              update({ mockStatusCode: parseInt(e.target.value) || 200 })
            }
            placeholder="200"
            min="100"
            max="599"
            className="font-mono"
          />
        </div>
      )}
    </div>
  );

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
          <ArrowBigUp size={16} className="text-violet-500" />
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          API Call
        </span>
        {isMock && (
          <span className="ml-auto inline-flex items-center rounded-full bg-yellow-50 px-1.5 py-0.5 text-xs font-medium text-yellow-600 border border-yellow-100">
            MOCK
          </span>
        )}
        <ToggleButton editing={editing} setEditing={setEditing} />
      </div>

      {editing ? editPanel : preview}

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
