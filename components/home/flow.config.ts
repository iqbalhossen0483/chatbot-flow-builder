import {
  DefaultEdgeOptions,
  Edge,
  FitViewOptions,
  Node,
  NodeTypes,
} from "@xyflow/react";
import EndNode from "./node/EndNode";
import MessageNode from "./node/MessageNode";
import StartNode from "./node/StartNode";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "start",
    data: { label: "Node 1", highlight: true },
    position: { x: 5, y: 5 },
    focusable: true,
  },
  {
    id: "2",
    type: "message",
    data: { label: "Node 2" },
    position: { x: 5, y: 100 },
    focusable: true,
  },
  {
    id: "3",
    type: "end",
    data: { label: "Node 3" },
    position: { x: 5, y: 200 },
    focusable: true,
  },
];

const initialEdges: Edge[] = [];

const fitViewOptions: FitViewOptions = {};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
};

const NODE_TYPES = {
  start: "start",
  end: "end",
  message: "message",
  userInput: "userInput",
  condition: "condition",
  api: "api",
  delay: "delay",
  jump: "jump",
};

const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  message: MessageNode,
};

export type NodeProps = {
  id: string;
  data: {
    label: string;
  };
};

export {
  defaultEdgeOptions,
  fitViewOptions,
  initialEdges,
  initialNodes,
  NODE_TYPES,
  nodeTypes,
};
