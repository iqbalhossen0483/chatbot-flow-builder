import DeleteButton from "@/components/libs/DeleteButton";
import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import clsx from "clsx";
import { useState } from "react";
import NodeAdder from "../NodeAdder";

type BaseNodeProps = {
  children: React.ReactNode;
  selected?: boolean; // true for condition node
  hideDefaultHandles?: boolean;
  className?: string;
};

export function BaseNode({
  children,
  selected,
  hideDefaultHandles = false,
  className = "",
}: BaseNodeProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { deleteElements } = useReactFlow();
  const nodeId = useNodeId();

  function handleDelete() {
    if (!nodeId) return;
    deleteElements({ nodes: [{ id: nodeId }] });
  }

  return (
    <>
      <div
        className={clsx(
          "rounded-xl border bg-white px-4 py-3 shadow-sm min-w-55 transition-all duration-150",
          {
            "border-blue-400 shadow-md ring-2 ring-blue-100": selected,
            "border-gray-200 hover:border-gray-300 hover:shadow-md": !selected,
            className,
          },
        )}
      >
        {!hideDefaultHandles && (
          <>
            <Handle
              type="target"
              position={Position.Top}
              className="w-3! h-3! bg-white! border-2! border-gray-300! hover:border-blue-400! transition-colors"
            />
            <Handle
              type="source"
              position={Position.Bottom}
              className="w-3! h-3! bg-white! border-2! border-gray-300! hover:border-blue-400! transition-colors"
            />
          </>
        )}

        {children}
        {selected && (
          <div className="absolute top-0 right-0">
            <DeleteButton onDelete={handleDelete} />
          </div>
        )}
      </div>
      {selected && (
        <NodeAdder selectedNodeId={nodeId} open={open} setOpen={setOpen} />
      )}
    </>
  );
}
