import type { CompileResponse } from "./types";

/** Map FastAPI JSON (camelCase aliases) into frontend CompileResponse */
export function normalizeCompileResponse(raw: Record<string, unknown>): CompileResponse {
  const semantic = (raw.semanticErrors ?? raw.semantic_errors ?? []) as CompileResponse["errors"];
  const symbols = (raw.symbolTable ?? raw.symbol_table ?? []) as CompileResponse["symbolTable"];

  return {
    tokens: (raw.tokens as CompileResponse["tokens"]) ?? [],
    errors: (raw.errors as CompileResponse["errors"]) ?? [],
    parseTree: (raw.parseTree ?? raw.parse_tree) as CompileResponse["parseTree"],
    status: (raw.status as CompileResponse["status"]) ?? "error",
    logs: (raw.logs as string[]) ?? [],
    phase: (raw.phase as CompileResponse["phase"]) ?? "output",
    semanticErrors: semantic,
    symbolTable: symbols,
  };
}
