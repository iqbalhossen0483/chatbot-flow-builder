import { Edge, Node } from "@xyflow/react";
import React from "react";
import Button from "../libs/Button";

interface Props {
  onGenerate: () => void;
}

const GenerateFlow = ({ onGenerate }: Props) => {
  return (
    <div>
      <Button variant="outlined" onClick={onGenerate}>
        Generate Flow
      </Button>
    </div>
  );
};

export default GenerateFlow;
