"use client";

import { useReactFlow } from "@xyflow/react";
import clsx from "clsx";
import { Check, Plus } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { NODE_PALETTE, NodePaletteMeta, NodeType } from "./flow.config";

// ─── Default data factory per node type ───────────────────────────────────────
function getDefaultData(type: NodeType): Record<string, unknown> {
  switch (type) {
    case "start":
      return {};
    case "end":
      return {};
    case "message":
      return { label: "New Message", messageType: "text", content: "" };
    case "userInput":
      return {
        label: "User Input",
        placeholder: "Type here…",
        inputType: "text",
        required: false,
        variableName: "{{user.value}}",
      };
    case "condition":
      return {
        label: "Condition",
        mode: "if_else",
        variable: "",
        branches: [
          { id: "true", label: "True" },
          { id: "false", label: "False" },
        ],
      };
    case "switch":
      return {
        label: "Switch",
        variable: "",
        cases: [
          { id: "case-1", label: "Case 1", value: "value_1" },
          { id: "case-2", label: "Case 2", value: "value_2" },
        ],
        hasDefault: true,
      };
    case "api":
      return {
        label: "API Call",
        url: "https://api.example.com/endpoint",
        method: "GET",
        mock: true,
        mockStatusCode: 200,
      };
    case "delay":
      return { label: "Delay", duration: 2, unit: "seconds" };
    case "jump":
      return { label: "Jump", targetNodeId: "", targetNodeLabel: "" };
    default:
      return { label: "New Node" };
  }
}

// ─── Node type color accent map ────────────────────────────────────────────────
const NODE_ACCENT: Record<string, string> = {
  start: "border-green-200 bg-green-50/60",
  end: "border-red-200 bg-red-50/60",
  message: "border-indigo-200 bg-indigo-50/60",
  userInput: "border-blue-200 bg-blue-50/60",
  condition: "border-amber-200 bg-amber-50/60",
  switch: "border-purple-200 bg-purple-50/60",
  api: "border-violet-200 bg-violet-50/60",
  delay: "border-cyan-200 bg-cyan-50/60",
  jump: "border-pink-200 bg-pink-50/60",
};

const NODE_ICON_BG: Record<string, string> = {
  start: "bg-green-100 text-green-600",
  end: "bg-red-100 text-red-500",
  message: "bg-indigo-100 text-indigo-500",
  userInput: "bg-blue-100 text-blue-500",
  condition: "bg-amber-100 text-amber-600",
  switch: "bg-purple-100 text-purple-500",
  api: "bg-violet-100 text-violet-500",
  delay: "bg-cyan-100 text-cyan-500",
  jump: "bg-pink-100 text-pink-500",
};

// ─── Props ────────────────────────────────────────────────────────────────────
type NodeAdderProps = {
  selectedNodeId: string | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function NodeAdder({
  selectedNodeId,
  open,
  setOpen,
}: NodeAdderProps) {
  const { getNode, addNodes, addEdges } = useReactFlow();
  const [hoveredType, setHoveredType] = useState<NodeType | null>(null);
  const [justAdded, setJustAdded] = useState<NodeType | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  //Reset open state when selection changes
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHoveredType(null);
  }, [selectedNodeId, setOpen]);

  const handleAddNode = useCallback(
    (type: NodeType) => {
      if (!selectedNodeId) return;

      const sourceNode = getNode(selectedNodeId);
      if (!sourceNode) return;

      // Position new node 160px below the source node
      const newPosition = {
        x: sourceNode.position.x,
        y: sourceNode.position.y + (sourceNode.measured?.height ?? 120) + 80,
      };

      const newId = `${type}-${Date.now()}`;

      addNodes({
        id: newId,
        type,
        data: getDefaultData(type),
        position: newPosition,
      });

      // Auto-connect with an edge
      addEdges({
        id: `e-${selectedNodeId}-${newId}`,
        source: selectedNodeId,
        target: newId,
        animated: false,
        style: { strokeWidth: 1.5, stroke: "#d1d5db" },
      });

      // Flash feedback
      setJustAdded(type);
      setTimeout(() => {
        setJustAdded(null);
        setOpen(false);
      }, 600);
    },
    [selectedNodeId, getNode, addNodes, addEdges, setOpen],
  );

  if (!selectedNodeId) return null;

  return (
    <div
      ref={popoverRef}
      className="relative flex flex-col items-center select-none"
    >
      {/* ── Big arrow trigger button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Add node below"
        className={clsx(
          "group flex flex-col items-center transition-all duration-200 outline-none absolute mt-1",
          {
            "opacity-100": open,
            "opacity-80 hover:opacity-100": !open,
          },
        )}
      >
        {/* Arrow shaft */}
        <div
          className={clsx("w-0.5 transition-all duration-300", {
            "h-6 bg-blue-400": open,
            "h-0 bg-gray-300 group-hover:bg-blue-400 group-hover:h-3": !open,
          })}
        />

        {/* Arrow head */}
        <div
          className={clsx(
            "flex items-center justify-center rounded-full border-2 shadow-sm size-6",
            {
              "border-blue-400 bg-blue-50 shadow-blue-100 shadow-md text-blue-500":
                open,
              "border-gray-300 bg-white group-hover:border-blue-400 text-gray-500 group-hover:bg-blue-50 group-hover:shadow-blue-100 group-hover:shadow-md group-hover:scale-110":
                !open,
            },
          )}
        >
          <Plus size={16} />
        </div>
      </button>

      {/* ── Node type popover ─────────────────────────────────────────────────── */}
      {open && (
        <div
          className={clsx(
            "absolute top-full z-50",
            "w-72 rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/80",
            "animate-in fade-in slide-in-from-top-2 duration-150",
          )}
          style={{ left: "50%", transform: "translateX(-50%)" }}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-2 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Add node
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Will be connected below selected node
            </p>
          </div>

          {/* Node grid */}
          <div className="p-3 grid grid-cols-2 gap-2">
            {NODE_PALETTE.map((item: NodePaletteMeta) => {
              const isHovered = hoveredType === item.type;
              const wasAdded = justAdded === item.type;
              const accent =
                NODE_ACCENT[item.type] ?? "border-gray-200 bg-gray-50";
              const iconBg =
                NODE_ICON_BG[item.type] ?? "bg-gray-100 text-gray-500";

              return (
                <button
                  key={item.type}
                  onClick={() => handleAddNode(item.type)}
                  onMouseEnter={() => setHoveredType(item.type)}
                  onMouseLeave={() => setHoveredType(null)}
                  className={[
                    "group relative flex items-start gap-2.5 rounded-xl border p-2.5",
                    "text-left transition-all duration-150 outline-none",
                    wasAdded
                      ? "border-green-300 bg-green-50 scale-95"
                      : isHovered
                        ? `${accent} shadow-sm scale-[1.02]`
                        : "border-gray-100 bg-white hover:shadow-sm",
                  ].join(" ")}
                >
                  {/* Icon */}
                  <span
                    className={[
                      "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-150",
                      wasAdded ? "bg-green-100 text-green-600" : iconBg,
                    ].join(" ")}
                  >
                    {wasAdded ? <Check size={16} /> : <item.icon size={16} />}
                  </span>

                  {/* Labels */}
                  <div className="min-w-0 flex-1">
                    <div
                      className={[
                        "text-xs font-semibold leading-tight transition-colors duration-150",
                        wasAdded ? "text-green-600" : "text-gray-700",
                      ].join(" ")}
                    >
                      {item.label}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="px-4 pb-3 pt-1">
            <p className="text-xs text-gray-300 text-center">
              Click any node type to add &amp; auto-connect
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
