export type TokenType =
  | "KEYWORD"
  | "IDENTIFIER"
  | "OPERATOR"
  | "NUMBER"
  | "DELIMITER"
  | "STRING"
  | "COMMENT";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface CompilerError {
  line: number;
  column: number;
  message: string;
  suggestion?: string;
  severity: "error" | "warning";
}

export interface ParseTreeNode {
  id: string;
  label: string;
  children?: ParseTreeNode[];
}

export type CompilerPhase =
  | "source"
  | "lexical"
  | "tokens"
  | "syntax"
  | "parseTree"
  | "errors"
  | "output";

export interface CompileResponse {
  tokens: Token[];
  errors: CompilerError[];
  parseTree: ParseTreeNode;
  status: "success" | "error" | "warning";
  logs: string[];
  phase: CompilerPhase;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
}
