import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

const nodeWidth = 200;
const nodeHeight = 60;

const colors = [
  { bg: "#dbeafe", border: "#3b82f6", edge: "#2563eb" },
  { bg: "#dcfce7", border: "#22c55e", edge: "#16a34a" },
  { bg: "#fef3c7", border: "#f59e0b", edge: "#d97706" },
  { bg: "#ede9fe", border: "#8b5cf6", edge: "#7c3aed" },
  { bg: "#fee2e2", border: "#ef4444", edge: "#dc2626" },
  { bg: "#cffafe", border: "#06b6d4", edge: "#0891b2" },
];

function getLayoutedElements(nodes, edges, direction = "TB") {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: 250,
    nodesep: 150
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      return node;
    }),
    edges,
  };
}

function MindmapView({ data, layout = 'TB', nodeStyle = 'rounded' }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const getNodeShape = (type = "subtopic") => {
    if (nodeStyle === "sharp") return 6;
    if (nodeStyle === "pill") return 9999;
    return type === "point" ? 12 : 16;
  };

  useEffect(() => {
    if (!data) return;
    let generatedNodes = [];
    let generatedEdges = [];

    const rootColor = colors[0];

    generatedNodes.push({
      id: "root",
      data: { label: data.topic },
      position: { x: 500, y: 300 },
      className: "font-bold shadow-md border-2",
      style: {
        backgroundColor: rootColor.bg,
        borderColor: rootColor.border,
        color: "#000000",
        borderRadius: getNodeShape("root"),
        padding: "12px 16px",
        fontSize: "16px",
      },
    });

    data.subtopics.forEach((sub, i) => {
      const subId = `sub-${i}`;
      const color = colors[i % colors.length];

      generatedNodes.push({
        id: subId,
        data: { label: sub.title },
        position: { x: 0, y: 0 },
        className: "font-semibold shadow-sm border-2",
        style: {
          backgroundColor: color.bg,
          borderColor: color.border,
          color: "#000000",
          borderRadius: getNodeShape("subtopic"),
          padding: "10px 14px",
          fontSize: "14px",
        },
      });

      generatedEdges.push({
        id: `e-root-${subId}`,
        source: "root",
        target: subId,
        animated: true,
        style: { stroke: color.edge, strokeWidth: 2.5 },
        type: "bezier",
      });

      sub.points.forEach((point, j) => {
        const pointId = `point-${i}-${j}`;
        const pointColor = colors[(i + j + 1) % colors.length];

        generatedNodes.push({
          id: pointId,
          data: { label: point },
          position: { x: 0, y: 0 },
          className: "shadow-sm border",
          style: {
            backgroundColor: "#ffffff",
            color: "#000000",
            borderColor: pointColor.border,
            borderRadius: getNodeShape("point"),
            padding: "8px 12px",
            fontSize: "12px",
          },
        });

        generatedEdges.push({
          id: `e-${subId}-${pointId}`,
          source: subId,
          target: pointId,
          style: { stroke: pointColor.edge, strokeWidth: 1.8 },
          type: "bezier",
        });
      });
    });

    const layouted = getLayoutedElements(generatedNodes, generatedEdges, layout);

    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [data, layout, nodeStyle]);

  return (
    <div
      id="mindmap"
      className="w-full h-[700px] bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm"
    >
      <ReactFlow
        key={`${layout}-${nodeStyle}-${nodes.length}-${edges.length}`}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) =>
          setEdges((eds) => addEdge(params, eds))
        }
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultZoom={0.9}
        minZoom={0.3}
        maxZoom={2}
        nodesDraggable
        nodesConnectable
        elementsSelectable
      >
        <Controls className="bg-white border border-blue-200 rounded-lg shadow-sm" />
        <Background gap={16} size={1} color="#bfdbfe" />
      </ReactFlow>
    </div>
  );
}

export default MindmapView;
