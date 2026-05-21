import type { CompileResponse, LogEntry, ParseTreeNode, Token } from "./types";

export const DEFAULT_SAMPLE_CODE = `int x = 10;
int y = 20;
int sum = x + y;
print(sum);`;

export const mockTokens: Token[] = [
  { type: "KEYWORD", value: "int", line: 1, column: 1 },
  { type: "IDENTIFIER", value: "x", line: 1, column: 5 },
  { type: "OPERATOR", value: "=", line: 1, column: 7 },
  { type: "NUMBER", value: "10", line: 1, column: 9 },
  { type: "DELIMITER", value: ";", line: 1, column: 11 },
  { type: "KEYWORD", value: "int", line: 2, column: 1 },
  { type: "IDENTIFIER", value: "y", line: 2, column: 5 },
  { type: "OPERATOR", value: "=", line: 2, column: 7 },
  { type: "NUMBER", value: "20", line: 2, column: 9 },
  { type: "DELIMITER", value: ";", line: 2, column: 11 },
  { type: "KEYWORD", value: "int", line: 3, column: 1 },
  { type: "IDENTIFIER", value: "sum", line: 3, column: 5 },
  { type: "OPERATOR", value: "=", line: 3, column: 9 },
  { type: "IDENTIFIER", value: "x", line: 3, column: 11 },
  { type: "OPERATOR", value: "+", line: 3, column: 13 },
  { type: "IDENTIFIER", value: "y", line: 3, column: 15 },
  { type: "DELIMITER", value: ";", line: 3, column: 16 },
  { type: "KEYWORD", value: "print", line: 4, column: 1 },
  { type: "DELIMITER", value: "(", line: 4, column: 6 },
  { type: "IDENTIFIER", value: "sum", line: 4, column: 7 },
  { type: "DELIMITER", value: ")", line: 4, column: 10 },
  { type: "DELIMITER", value: ";", line: 4, column: 11 },
];

export const mockParseTree: ParseTreeNode = {
  id: "program",
  label: "Program",
  children: [
    {
      id: "decl1",
      label: "Declaration",
      children: [
        { id: "type1", label: "Type: int" },
        { id: "id1", label: "Identifier: x" },
        {
          id: "init1",
          label: "Initializer",
          children: [{ id: "num1", label: "Literal: 10" }],
        },
      ],
    },
    {
      id: "decl2",
      label: "Declaration",
      children: [
        { id: "type2", label: "Type: int" },
        { id: "id2", label: "Identifier: y" },
        {
          id: "init2",
          label: "Initializer",
          children: [{ id: "num2", label: "Literal: 20" }],
        },
      ],
    },
    {
      id: "decl3",
      label: "Declaration",
      children: [
        { id: "type3", label: "Type: int" },
        { id: "id3", label: "Identifier: sum" },
        {
          id: "binop",
          label: "BinaryExpr: +",
          children: [
            { id: "ref1", label: "Identifier: x" },
            { id: "ref2", label: "Identifier: y" },
          ],
        },
      ],
    },
    {
      id: "stmt1",
      label: "PrintStmt",
      children: [{ id: "ref3", label: "Identifier: sum" }],
    },
  ],
};

export const mockSuccessResponse: CompileResponse = {
  tokens: mockTokens,
  errors: [],
  parseTree: mockParseTree,
  status: "success",
  logs: [
    "Lexical analysis completed: 22 tokens generated",
    "Syntax analysis passed with no errors",
    "Parse tree constructed successfully",
    "Compilation finished — ready for code generation",
  ],
  phase: "output",
};

export const mockErrorResponse: CompileResponse = {
  tokens: [
    { type: "KEYWORD", value: "int", line: 1, column: 1 },
    { type: "IDENTIFIER", value: "x", line: 1, column: 5 },
    { type: "OPERATOR", value: "=", line: 1, column: 7 },
    { type: "NUMBER", value: "10", line: 1, column: 9 },
  ],
  errors: [
    {
      line: 1,
      column: 11,
      message: "Expected ';' after declaration",
      suggestion: "Add a semicolon at the end of line 1: int x = 10;",
      severity: "error",
    },
    {
      line: 2,
      column: 1,
      message: "Unexpected token 'int' — previous statement incomplete",
      suggestion: "Fix line 1 before declaring new variables",
      severity: "warning",
    },
  ],
  parseTree: {
    id: "program",
    label: "Program (partial)",
    children: [
      {
        id: "decl1",
        label: "Declaration (incomplete)",
        children: [
          { id: "type1", label: "Type: int" },
          { id: "id1", label: "Identifier: x" },
        ],
      },
    ],
  },
  status: "error",
  logs: [
    "Lexical analysis completed: 4 tokens (stream truncated)",
    "Syntax error at line 1, column 11",
    "Parse tree generation halted due to syntax errors",
  ],
  phase: "errors",
};

export function generateMockLogs(hasErrors: boolean): LogEntry[] {
  const base: LogEntry[] = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Starting compilation pipeline...",
    },
    {
      id: "2",
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Phase 1: Lexical Analysis — scanning source code",
    },
    {
      id: "3",
      timestamp: new Date().toISOString(),
      level: "success",
      message: "Phase 2: Token stream generated",
    },
    {
      id: "4",
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Phase 3: Syntax Analysis — building parse tree",
    },
  ];

  if (hasErrors) {
    return [
      ...base,
      {
        id: "5",
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Syntax error detected — see error panel",
      },
      {
        id: "6",
        timestamp: new Date().toISOString(),
        level: "warn",
        message: "Intelligent suggestions available",
      },
    ];
  }

  return [
    ...base,
    {
      id: "5",
      timestamp: new Date().toISOString(),
      level: "success",
      message: "Compilation successful — no errors found",
    },
  ];
}

export const COMPILER_PHASES = [
  { id: "source", label: "Source Code", icon: "FileCode" },
  { id: "lexical", label: "Lexical Analysis", icon: "Scan" },
  { id: "tokens", label: "Token Generation", icon: "Tags" },
  { id: "syntax", label: "Syntax Analysis", icon: "GitBranch" },
  { id: "parseTree", label: "Parse Tree", icon: "Network" },
  { id: "errors", label: "Error Detection", icon: "AlertTriangle" },
  { id: "output", label: "Final Output", icon: "CheckCircle" },
] as const;
