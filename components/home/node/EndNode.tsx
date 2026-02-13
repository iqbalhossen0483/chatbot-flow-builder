import DeleteButton from "@/components/libs/DeleteButton";
import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";

type EndNodeProps = {
  id: string;
  data: { label?: string };
  selected?: boolean;
};

export default function EndNode({ selected }: EndNodeProps) {
  const nodeId = useNodeId();
  const { deleteElements } = useReactFlow();

  function handleDelete() {
    if (!nodeId) return;
    deleteElements({ nodes: [{ id: nodeId }] });
  }
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm shadow-sm border-2 transition-all duration-150 bg-white",
        selected
          ? "border-red-500 shadow-md ring-2 ring-red-100 text-red-700"
          : "border-red-400 text-red-500 hover:border-red-500 hover:shadow-md",
      ].join(" ")}
    >
      {/* Stop square */}
      <span className="inline-flex h-2.5 w-2.5 rounded-sm bg-red-500" />
      End
      <Handle
        type="target"
        position={Position.Top}
        className="w-3! h-3! bg-white! border-2! border-red-400!"
      />
      {selected && (
        <div className="absolute top-0 right-0">
          <DeleteButton onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
