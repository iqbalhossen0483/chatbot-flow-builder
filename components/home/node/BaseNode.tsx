import { Handle, Position } from "@xyflow/react";

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
  return (
    <div
      className={[
        "rounded-xl border bg-white px-4 py-3 shadow-sm min-w-55 transition-all duration-150",
        selected
          ? "border-blue-400 shadow-md ring-2 ring-blue-100"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
    </div>
  );
}
