"use client";
import { Node, useReactFlow } from "@xyflow/react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { addNodes } = useReactFlow();

  const historyItems = [
    "Design v1",
    "Landing Page",
    "Dashboard UI",
    "Mobile Layout",
    "Final Concept",
  ];

  function handleInitWorkspace() {
    const initialNewNodes: Node[] = [
      {
        id: "start-1",
        type: "start",
        data: {},
        position: { x: 480, y: 0 },
      },
    ];
    addNodes(initialNewNodes);
  }

  return (
    <aside
      className={`fixed top-4 bottom-4 left-4 z-10 flex flex-col
      rounded-2xl transition-all duration-300 ease-in-out border-gray-200
      ${collapsed ? "w-15 bg-transparent" : "w-72 bg-white border shadow-sm"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-700">Workspace</span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx("rounded-lg p-1.5 hover:bg-gray-100", {
            "bg-gray-200 shadow-md": collapsed,
          })}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* New Design */}
      {!collapsed && (
        <>
          <div className="px-3">
            <button
              onClick={handleInitWorkspace}
              className="flex w-full items-center gap-2 rounded-xl
          border border-gray-200 px-3 py-2.5 text-sm font-medium
          hover:bg-gray-50"
            >
              <Plus size={16} />
              <span>New Workspace</span>
            </button>
          </div>

          {/* History */}
          <div className="mt-6 flex-1 overflow-auto px-3">
            {!collapsed && (
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                History
              </h3>
            )}

            <ul className="space-y-1">
              {historyItems.map((item, index) => (
                <li
                  key={index}
                  className="group flex cursor-pointer items-center gap-2
              rounded-lg px-3 py-2 text-sm text-gray-700
              hover:bg-gray-100"
                >
                  <Clock size={14} className="text-gray-400" />
                  {!collapsed && <span className="truncate">{item}</span>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
