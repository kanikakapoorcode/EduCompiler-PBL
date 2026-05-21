"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import type { ParseTreeNode } from "@/lib/types";
import { parseTreeToFlow } from "@/lib/parse-tree-utils";

function ParseNode({ data }: { data: { label: string } }) {
  return (
    <div className="text-xs font-medium text-center px-1">{data.label}</div>
  );
}

const nodeTypes: NodeTypes = {
  parseNode: ParseNode,
};

interface ParseTreeViewProps {
  tree: ParseTreeNode | null;
  visible: boolean;
}

export function ParseTreeView({ tree, visible }: ParseTreeViewProps) {
  const { nodes, edges } = useMemo(() => {
    if (!tree) return { nodes: [], edges: [] };
    return parseTreeToFlow(tree);
  }, [tree]);

  if (!visible || !tree) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Parse tree will appear after syntax analysis
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-64 sm:h-72 w-full rounded-lg overflow-hidden border border-white/10"
    >
      <ReactFlow
        nodes={nodes as Node[]}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor="#6366f1"
          maskColor="rgba(3, 7, 18, 0.8)"
        />
      </ReactFlow>
    </motion.div>
  );
}
