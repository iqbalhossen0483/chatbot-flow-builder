"use client";
import {
  Background,
  Connection,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  reconnectEdge,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { MouseEvent, useCallback, useState } from "react";
import {
  defaultEdgeOptions,
  fitViewOptions,
  initialEdges,
  initialNodes,
  nodeTypes,
} from "./flow.config";

function FlowContainer() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    [],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
      deleteKeyCode={["Delete"]}
      elevateEdgesOnSelect={true}
      edgesReconnectable={true}
      onReconnect={onReconnect}
    >
      <Background />
    </ReactFlow>
  );
}

export default FlowContainer;
