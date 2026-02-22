import { Edge, Node } from "@xyflow/react";
import React from "react";
import Button from "../libs/Button";

interface Props {
  nodes: Node[];
  edges: Edge[];
}

const GenerateFlow = ({ nodes, edges }: Props) => {
  return (
    <div>
      <Button variant="outlined">Generate Flow</Button>
    </div>
  );
};

export default GenerateFlow;
