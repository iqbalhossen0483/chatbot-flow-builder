import { Handle, Position } from "@xyflow/react";

function EndNode() {
  return (
    <div className="rounded-full bg-red-500 text-white px-4 py-2">
      End
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

export default EndNode;
