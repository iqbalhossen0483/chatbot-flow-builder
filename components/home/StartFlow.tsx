import { Edge, Node } from "@xyflow/react";
import { Play } from "lucide-react";
import Button from "../libs/Button";

const StartFlow = () => {
  return (
    <div>
      <Button variant="contained">
        <Play size={16} /> Start Flow
      </Button>
    </div>
  );
};

export default StartFlow;
