import {
  DefaultEdgeOptions,
  Edge,
  FitViewOptions,
  Node,
  NodeTypes,
} from "@xyflow/react";

// Node components
import { chatbotUIEdge01, chatbotUINode01 } from "./examples/chatbot-ui-01";
import ApiNode from "./node/ApiNode";
import ConditionNode from "./node/ConditionNode";
import DelayNode from "./node/DelayNode";
import EndNode from "./node/EndNode";
import JumpNode from "./node/JumpNode";
import MessageNode from "./node/MessageNode";
import StartNode from "./node/StartNode";
import SwitchNode from "./node/SwitchNode";
import UserInputNode from "./node/UserInputNode";

// ─── Node type keys ────────────────────────────────────────────────────────────
export const NODE_TYPES = {
  start: "start",
  end: "end",
  message: "message",
  userInput: "userInput",
  condition: "condition",
  switch: "switch",
  api: "api",
  delay: "delay",
  jump: "jump",
} as const;

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

// ─── Sidebar palette meta (used to render the draggable node list) ─────────────
export type NodePaletteMeta = {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
  color: string; // Tailwind bg class for the dot/icon bg
};

export const NODE_PALETTE: NodePaletteMeta[] = [
  {
    type: "start",
    label: "Start",
    icon: "▶",
    description: "Entry point of the flow",
    color: "bg-green-100 text-green-600",
  },
  {
    type: "end",
    label: "End",
    icon: "■",
    description: "Terminates the flow",
    color: "bg-red-100 text-red-500",
  },
  {
    type: "message",
    label: "Message",
    icon: "💬",
    description: "Send text, image, or link",
    color: "bg-indigo-100 text-indigo-500",
  },
  {
    type: "userInput",
    label: "User Input",
    icon: "✏️",
    description: "Collect input from user",
    color: "bg-blue-100 text-blue-500",
  },
  {
    type: "condition",
    label: "Condition",
    icon: "⑂",
    description: "Branch with if/else",
    color: "bg-amber-100 text-amber-600",
  },
  {
    type: "switch",
    label: "Switch",
    icon: "≡",
    description: "Multi-case branching",
    color: "bg-purple-100 text-purple-500",
  },
  {
    type: "api",
    label: "API Call",
    icon: "⬆",
    description: "HTTP request or webhook",
    color: "bg-violet-100 text-violet-500",
  },
  {
    type: "delay",
    label: "Delay / Wait",
    icon: "⏱",
    description: "Pause flow execution",
    color: "bg-cyan-100 text-cyan-500",
  },
  {
    type: "jump",
    label: "Jump",
    icon: "↪",
    description: "Redirect to another node",
    color: "bg-pink-100 text-pink-500",
  },
];

// ─── ReactFlow nodeTypes map ───────────────────────────────────────────────────
export const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  message: MessageNode,
  userInput: UserInputNode,
  condition: ConditionNode,
  switch: SwitchNode,
  api: ApiNode,
  delay: DelayNode,
  jump: JumpNode,
};

export const initialNodes: Node[] = chatbotUINode01;

export const initialEdges: Edge[] = chatbotUIEdge01;

// ─── ReactFlow options ────────────────────────────────────────────────────────
export const fitViewOptions: FitViewOptions = {
  padding: 0.2,
  maxZoom: 1,
};

export const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  style: { strokeWidth: 1.5, stroke: "#d1d5db" },
};

// ─── Legacy NodeProps type (kept for compat) ───────────────────────────────────
export type NodeProps = {
  id: string;
  data: {
    label: string;
  };
};
