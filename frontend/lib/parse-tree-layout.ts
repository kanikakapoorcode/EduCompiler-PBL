import type { ParseTreeNode } from "./types";

export type LayoutNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  depth: number;
  parentId: string | null;
  isLeaf: boolean;
};

export type LayoutEdge = {
  id: string;
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const NODE_W = 130;
const NODE_H = 44;
const H_GAP = 36;
const V_GAP = 72;

function leafSlots(node: ParseTreeNode): number {
  const ch = node.children ?? [];
  return ch.length === 0 ? 1 : ch.reduce((s, c) => s + leafSlots(c), 0);
}

export function computeTreeLayout(
  tree: ParseTreeNode,
  visibleIds?: Set<string>
): { nodes: LayoutNode[]; edges: LayoutEdge[]; width: number; height: number } {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];
  const positions = new Map<string, { x: number; y: number; depth: number }>();

  function walk(
    node: ParseTreeNode,
    depth: number,
    slotStart: number,
    parentId: string | null
  ): number {
    const id = node.id;
    const show = !visibleIds || visibleIds.has(id);
    const leaves = leafSlots(node);
    const cx = (slotStart + leaves / 2) * (NODE_W + H_GAP);
    const cy = depth * (NODE_H + V_GAP) + 24;

    if (show) {
      positions.set(id, { x: cx, y: cy, depth });
      nodes.push({
        id,
        label: node.label,
        x: cx,
        y: cy,
        depth,
        parentId,
        isLeaf: !(node.children?.length),
      });

      if (parentId && positions.has(parentId)) {
        const p = positions.get(parentId)!;
        edges.push({
          id: `e-${parentId}-${id}`,
          from: parentId,
          to: id,
          x1: p.x + NODE_W / 2,
          y1: p.y + NODE_H,
          x2: cx + NODE_W / 2,
          y2: cy,
        });
      }
    }

    let slot = slotStart;
    for (const child of node.children ?? []) {
      slot = walk(child, depth + 1, slot, show ? id : parentId);
    }
    return slotStart + leaves;
  }

  const totalLeaves = leafSlots(tree);
  walk(tree, 0, 0, null);

  const width = Math.max(totalLeaves * (NODE_W + H_GAP), 320);
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const height = (maxDepth + 1) * (NODE_H + V_GAP) + 48;

  return { nodes, edges, width, height };
}

export { NODE_W, NODE_H };
