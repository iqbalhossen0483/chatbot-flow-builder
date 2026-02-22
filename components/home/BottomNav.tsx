import { Edge, Node } from "@xyflow/react";
import React from "react";
import GenerateFlow from "./GenerateFlow";
import SaveFlowToBackend from "./SaveFlowToBackend";
import StartFlow from "./StartFlow";

interface Props {
  nodes: Node[];
  edges: Edge[];
  onGenerate: () => void;
}

const BottomNav = ({ nodes, edges, onGenerate }: Props) => {
  return (
    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
      <StartFlow />
      <GenerateFlow onGenerate={onGenerate} />
      <SaveFlowToBackend nodes={nodes} edges={edges} />
    </div>
  );
};

export default BottomNav;
