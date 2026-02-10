import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

type DelayUnit = "seconds" | "minutes" | "hours" | "days";

type DelayNodeData = {
  label: string;
  duration?: number;
  unit?: DelayUnit;
  description?: string;
};

type DelayNodeProps = {
  id: string;
  data: DelayNodeData;
  selected?: boolean;
};

const UNIT_SHORT: Record<DelayUnit, string> = {
  seconds: "sec",
  minutes: "min",
  hours: "hr",
  days: "day",
};

const UNIT_ICON: Record<DelayUnit, string> = {
  seconds: "⚡",
  minutes: "⏱",
  hours: "🕐",
  days: "📅",
};

function formatDuration(duration: number, unit: DelayUnit): string {
  const short = UNIT_SHORT[unit];
  return `${duration} ${duration === 1 ? short : short + "s"}`;
}

export default function DelayNode({ data, selected }: DelayNodeProps) {
  const duration = data.duration ?? 0;
  const unit = data.unit ?? "seconds";
  const hasDuration = duration > 0;

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-cyan-50 flex items-center justify-center shrink-0">
          <svg
            className="w-3.5 h-3.5 text-cyan-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
          Delay / Wait
        </span>
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <div className="text-sm text-gray-800 font-medium truncate max-w-45">
          {data.label || "Untitled delay"}
        </div>

        {/* Duration badge */}
        <div className="flex items-center gap-1.5">
          {hasDuration ? (
            <div className="flex items-center gap-1 bg-cyan-50 border border-cyan-100 rounded-full px-2.5 py-0.5">
              <span className="text-sm">{UNIT_ICON[unit]}</span>
              <span className="text-xs font-semibold text-cyan-700 font-mono">
                {formatDuration(duration, unit)}
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-400 border border-gray-100">
              No duration set
            </span>
          )}
        </div>

        {data.description && (
          <div className="text-xs text-gray-400 truncate max-w-45">
            {data.description}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3! h-3! bg-white! border-2! border-cyan-400!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3! h-3! bg-white! border-2! border-cyan-400!"
      />
    </BaseNode>
  );
}
