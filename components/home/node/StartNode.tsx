import { Handle, Position } from "@xyflow/react";

type StartNodeProps = {
  id: string;
  data: { label?: string };
  selected?: boolean;
};

export default function StartNode({ selected }: StartNodeProps) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm shadow-sm border-2 transition-all duration-150 bg-white",
        selected
          ? "border-green-500 shadow-md ring-2 ring-green-100 text-green-700"
          : "border-green-400 text-green-600 hover:border-green-500 hover:shadow-md",
      ].join(" ")}
    >
      {/* Pulse dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
      </span>
      Start
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3! h-3! bg-white! border-2! border-green-400!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3! h-3! bg-white! border-2! border-green-400!"
      />
    </div>
  );
}
