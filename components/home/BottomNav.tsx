import { Edge, Node } from "@xyflow/react";
import React from "react";
import GenerateFlow from "./GenerateFlow";
import SaveFlowToBackend from "./SaveFlowToBackend";
import StartFlow from "./StartFlow";

interface Props {
  nodes: Node[];
  edges: Edge[];
}

const BottomNav = ({ nodes, edges }: Props) => {
  return (
    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
      <StartFlow nodes={nodes} edges={edges} />
      <GenerateFlow nodes={nodes} edges={edges} />
      <SaveFlowToBackend nodes={nodes} edges={edges} />
    </div>
  );
};

export default BottomNav;
