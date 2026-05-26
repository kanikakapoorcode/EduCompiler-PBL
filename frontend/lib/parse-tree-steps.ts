import type { ParseTreeNode, Token } from "./types";

export type ParseBuildStep = {
  index: number;
  nodeId: string | null;
  node: ParseTreeNode | null;
  parentId: string | null;
  message: string;
  phase: "ready" | "token" | "structure";
  /** Token indices highlighted as "currently processing" */
  activeTokenIndices: number[];
  /** Token indices already consumed by earlier steps */
  consumedTokenIndices: number[];
  /** All node ids visible after this step */
  visibleNodeIds: string[];
};

function matchTokenForLabel(
  label: string,
  tokens: Token[],
  consumed: Set<number>
): number[] {
  const indices: number[] = [];

  const typeMatch = label.match(/^Type:\s*(.+)$/i);
  if (typeMatch) {
    const v = typeMatch[1].trim();
    const i = tokens.findIndex(
      (t, idx) => !consumed.has(idx) && t.type === "KEYWORD" && t.value === v
    );
    if (i >= 0) indices.push(i);
    return indices;
  }

  const idMatch = label.match(/^Identifier:\s*(.+)$/i);
  if (idMatch) {
    const v = idMatch[1].trim();
    const i = tokens.findIndex(
      (t, idx) => !consumed.has(idx) && t.type === "IDENTIFIER" && t.value === v
    );
    if (i >= 0) indices.push(i);
    return indices;
  }

  const litMatch = label.match(/^Literal:\s*(.+)$/i);
  if (litMatch) {
    const v = litMatch[1].trim();
    const i = tokens.findIndex(
      (t, idx) => !consumed.has(idx) && t.type === "NUMBER" && t.value === v
    );
    if (i >= 0) indices.push(i);
    return indices;
  }

  const binMatch = label.match(/^BinaryExpr:\s*(.+)$/i);
  if (binMatch) {
    const op = binMatch[1].trim();
    const i = tokens.findIndex(
      (t, idx) => !consumed.has(idx) && t.type === "OPERATOR" && t.value === op
    );
    if (i >= 0) indices.push(i);
    return indices;
  }

  if (/^PrintStmt$/i.test(label)) {
    const i = tokens.findIndex(
      (t, idx) => !consumed.has(idx) && t.type === "KEYWORD" && t.value === "print"
    );
    if (i >= 0) indices.push(i);
  }

  if (/^Declaration/i.test(label)) {
    const i = tokens.findIndex(
      (t, idx) =>
        !consumed.has(idx) &&
        t.type === "KEYWORD" &&
        ["int", "float", "void"].includes(t.value)
    );
    if (i >= 0) indices.push(i);
  }

  if (/^Program/i.test(label)) {
    return [];
  }

  if (/^Statement$/i.test(label) || /^Initializer/i.test(label)) {
    return [];
  }

  return indices;
}

function flattenPreorder(
  node: ParseTreeNode,
  parentId: string | null,
  out: { node: ParseTreeNode; parentId: string | null }[]
): void {
  out.push({ node, parentId });
  for (const child of node.children ?? []) {
    flattenPreorder(child, node.id, out);
  }
}

export function buildParseTreeSteps(
  tree: ParseTreeNode,
  tokens: Token[]
): ParseBuildStep[] {
  const order: { node: ParseTreeNode; parentId: string | null }[] = [];
  flattenPreorder(tree, null, order);

  const consumed = new Set<number>();
  const visibleNodeIds: string[] = [];
  const steps: ParseBuildStep[] = [
    {
      index: 0,
      nodeId: null,
      node: null,
      parentId: null,
      phase: "ready",
      message: `Lexer produced ${tokens.length} token${tokens.length === 1 ? "" : "s"} — starting syntax analysis`,
      activeTokenIndices: [],
      consumedTokenIndices: [],
      visibleNodeIds: [],
    },
  ];

  order.forEach((entry, index) => {
    const stepIndex = index + 1;
    const { node, parentId } = entry;
    const matched = matchTokenForLabel(node.label, tokens, consumed);
    matched.forEach((i) => consumed.add(i));

    visibleNodeIds.push(node.id);

    const hasTokens = matched.length > 0;
    const message = hasTokens
      ? `Shift: ${matched.map((i) => `"${tokens[i].value}"`).join(", ")} → reduce to «${node.label}»`
      : `Reduce: create «${node.label}»`;

    steps.push({
      index: stepIndex,
      nodeId: node.id,
      node,
      parentId,
      phase: hasTokens ? "token" : "structure",
      message,
      activeTokenIndices: matched,
      consumedTokenIndices: [...consumed],
      visibleNodeIds: [...visibleNodeIds],
    });
  });

  return steps;
}
