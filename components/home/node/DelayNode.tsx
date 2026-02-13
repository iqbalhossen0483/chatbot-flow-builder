import ToggleButton from "@/components/libs/ToggleButton";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Calendar, Clock, Clock3, LucideProps, Zap } from "lucide-react";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useState,
} from "react";
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

const UNIT_ICON: Record<
  string,
  ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
> = {
  seconds: Zap,
  minutes: Clock,
  hours: Clock3,
  days: Calendar,
};

const UNIT_LABELS: Record<DelayUnit, string> = {
  seconds: "Seconds",
  minutes: "Minutes",
  hours: "Hours",
  days: "Days",
};

const ALL_UNITS: DelayUnit[] = ["seconds", "minutes", "hours", "days"];

function formatDuration(duration: number, unit: DelayUnit): string {
  const short = UNIT_SHORT[unit];
  return `${duration} ${duration === 1 ? short : short + "s"}`;
}

export default function DelayNode({ id, data, selected }: DelayNodeProps) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);

  const duration = data.duration ?? 0;
  const unit = data.unit ?? "seconds";
  const hasDuration = duration > 0;
  const Icon = UNIT_ICON[unit];

  const update = useCallback(
    (patch: Partial<DelayNodeData>) => updateNodeData(id, patch),
    [id, updateNodeData],
  );

  // ── Collapsed preview ────────────────────────────────────────────────────
  const preview = (
    <div className="space-y-1.5">
      <div className="text-sm text-gray-800 font-medium truncate max-w-45">
        {data.label || "Untitled delay"}
      </div>

      {/* Duration badge */}
      <div className="flex items-center gap-1.5">
        {hasDuration ? (
          <div className="flex items-center gap-1 bg-cyan-50 border border-cyan-100 rounded-full px-2.5 py-0.5">
            <Icon size={14} className="text-cyan-500" />
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
          placeholder="Delay label…"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Duration
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => update({ duration: parseInt(e.target.value) || 0 })}
          placeholder="0"
          min="0"
          className="font-mono"
        />
      </div>

      {/* Unit selector */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Time Unit
        </label>
        <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-0.5">
          {ALL_UNITS.map((u) => {
            const Icon = UNIT_ICON[u];
            return (
              <button
                key={u}
                onClick={() => update({ unit: u })}
                className={[
                  "flex items-center justify-center gap-1 rounded-md py-1.5 px-2 text-[10px] font-semibold transition-all duration-150",
                  unit === u
                    ? "bg-white text-cyan-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                ].join(" ")}
              >
                <Icon size={14} />
                {UNIT_LABELS[u]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Description
        </label>
        <textarea
          value={data.description ?? ""}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Optional note about this delay…"
          rows={2}
          className="resize-none"
        />
      </div>

      {/* Preview of total time */}
      {hasDuration && (
        <div className="bg-cyan-50 border border-cyan-100 rounded-lg px-3 py-2">
          <div className="text-[10px] font-semibold text-cyan-600 uppercase tracking-widest mb-0.5">
            Wait Time
          </div>
          <div className="flex items-center gap-1.5">
            <Icon size={14} className="text-cyan-500" />
            <span className="text-sm font-bold text-cyan-700 font-mono">
              {formatDuration(duration, unit)}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <BaseNode selected={selected}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="size-6 rounded-md bg-cyan-50 flex items-center justify-center shrink-0">
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
        <ToggleButton editing={editing} setEditing={setEditing} />
      </div>

      {editing ? editPanel : preview}

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
