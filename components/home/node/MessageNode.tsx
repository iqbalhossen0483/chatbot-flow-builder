import { NodeProps } from "../flow.config";
import { BaseNode } from "./BaseNode";

export default function MessageNode({ data }: NodeProps) {
  return (
    <BaseNode>
      <div className="text-sm font-semibold">💬 Message</div>
      <div className="text-xs text-gray-500 truncate">
        {data.label || "Click to edit"}
      </div>
    </BaseNode>
  );
}
