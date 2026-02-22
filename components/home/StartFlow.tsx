import { Edge, Node } from "@xyflow/react";
import { Play } from "lucide-react";
import Button from "../libs/Button";

interface Props {
  nodes: Node[];
  edges: Edge[];
}

const StartFlow = ({ nodes, edges }: Props) => {
  return (
    <div>
      <Button variant="contained">
        <Play size={16} /> Start Flow
      </Button>
    </div>
  );
};

export default StartFlow;
