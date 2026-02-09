import { Handle, Position } from "@xyflow/react";

export function BaseNode({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3 shadow-md">
      <Handle type="source" position={Position.Top} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />

      {children}
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Right} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
