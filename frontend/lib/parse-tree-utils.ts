import type { Edge, Node } from "reactflow";
import type { ParseTreeNode } from "./types";

let nodeCounter = 0;

function nextId(): string {
  nodeCounter += 1;
  return `node-${nodeCounter}`;
}

export function parseTreeToFlow(
  tree: ParseTreeNode
): { nodes: Node[]; edges: Edge[] } {
  nodeCounter = 0;
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function walk(
    node: ParseTreeNode,
    depth: number,
    index: number,
    parent?: string
  ): string {
    const id = node.id || nextId();
    const x = index * 220 - (depth > 0 ? 0 : 0);
    const y = depth * 100;

    nodes.push({
      id,
      data: { label: node.label },
      position: { x: x + depth * 40, y },
      type: "parseNode",
      style: {
        background: "rgba(15, 23, 42, 0.9)",
        border: "1px solid rgba(99, 102, 241, 0.4)",
        borderRadius: "8px",
        color: "#e2e8f0",
        fontSize: "12px",
        padding: "8px 12px",
        minWidth: 120,
      },
    });

    if (parent) {
      edges.push({
        id: `e-${parent}-${id}`,
        source: parent,
        target: id,
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 },
      });
    }

    const children = node.children ?? [];
    children.forEach((child, i) => {
      walk(child, depth + 1, i, id);
    });

    return id;
  }

  walk(tree, 0, 0);
  return { nodes, edges };
}
