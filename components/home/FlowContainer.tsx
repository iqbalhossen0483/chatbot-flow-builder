"use client";
import { clearHistory } from "@/components/libs/flowDB";
import { useFlowHistory } from "@/hooks/useFlowHistory";
import {
  Background,
  Connection,
  OnSelectionChangeParams,
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
import { useCallback, useRef, useState } from "react";
import {
  defaultEdgeOptions,
  fitViewOptions,
  initialEdges,
  initialNodes,
  nodeTypes,
} from "./flow.config";
import Toolbar from "./Toolbar";

export default function FlowContainer() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const { save, undo, redo, canUndo, canRedo, saveStatus, isRestoring } =
    useFlowHistory(setNodes, setEdges, { debounceMs: 1500 });
  const edgesRef = useRef(edges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const isMutation = changes.some((c) =>
        ["add", "remove", "position"].includes(c.type),
      );
      setNodes((nds) => {
        const next = applyNodeChanges(changes, nds);
        if (isMutation) save(next, edges);
        return next;
      });
    },
    [edges, save],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        const next = applyEdgeChanges(changes, eds);
        save(nodes, next);
        return next;
      });
    },
    [nodes, save],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => {
        const next = addEdge(connection, eds);
        save(nodes, next);
        return next;
      });
    },
    [nodes, save],
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((els) => {
        const next = reconnectEdge(oldEdge, newConnection, els);
        save(nodes, next);
        return next;
      });
    },
    [nodes, save],
  );

  const handleClear = useCallback(async () => {
    await clearHistory();
    setNodes([]);
    setEdges([]);
  }, []);

  // Track which nodes are selected
  const onSelectionChange = useCallback(
    ({ nodes: sel }: OnSelectionChangeParams) => {
      setSelectedNodes(sel);
    },
    [],
  );

  const handleDuplicateSelected = useCallback(() => {
    if (!selectedNodes.length) return;
    const OFFSET = 40;
    const newNodes: Node[] = selectedNodes.map((n) => ({
      ...n,
      id: `${n.id}-copy-${Date.now()}-${Math.random()}`,
      selected: false,
      position: {
        x: n.position.x + OFFSET,
        y: n.position.y + OFFSET,
      },
    }));
    setNodes((nds) => {
      const next = [...nds, ...newNodes];
      save(next, edgesRef.current);
      return next;
    });
  }, [selectedNodes, save]);

  if (isRestoring) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
        Restoring last session…
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <Toolbar
        canRedo={canRedo}
        canUndo={canUndo}
        saveStatus={saveStatus}
        onClear={handleClear}
        onRedo={redo}
        onUndo={undo}
        onDuplicate={handleDuplicateSelected}
        selectedNodesCount={selectedNodes.length}
      />

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
        multiSelectionKeyCode="Shift"
        selectionOnDrag={true}
        elevateEdgesOnSelect
        edgesReconnectable
        onReconnect={onReconnect}
        onSelectionChange={onSelectionChange}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
