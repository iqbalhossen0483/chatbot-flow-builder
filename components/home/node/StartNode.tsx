import { Handle, Position } from "@xyflow/react";

function StartNode() {
  return (
    <div className="rounded-full bg-green-500 text-white px-4 py-2">
      Start
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default StartNode;
