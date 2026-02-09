import { Handle, Position, useReactFlow } from "@xyflow/react";
import { ChangeEvent } from "react";

type CustomNodeProps = {
  id: string;
  data: {
    label: string;
  };
};

function NodeContainer({ id, data }: CustomNodeProps) {
  const { setNodes } = useReactFlow();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: value,
              },
            }
          : node,
      ),
    );
  };

  return (
    <div className="rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-md">
      <Handle type="target" position={Position.Top} />

      <input
        value={data.label}
        onChange={onChange}
        className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-blue-500"
      />

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default NodeContainer;
