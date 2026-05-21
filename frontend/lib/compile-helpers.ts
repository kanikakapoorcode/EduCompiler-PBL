import type { CompilerError, CompilerPhase, LogEntry } from "./types";

export const PHASE_LOG_MESSAGES: Record<CompilerPhase, string> = {
  source: "Reading source code...",
  lexical: "Phase 1: Lexical Analysis — scanning characters",
  tokens: "Phase 2: Token Generation — building token stream",
  syntax: "Phase 3: Syntax Analysis — validating grammar",
  parseTree: "Phase 4: Parse Tree Construction",
  errors: "Phase 5: Error Detection — checking diagnostics",
  output: "Phase 6: Final Output — compilation complete",
};

let logCounter = 0;

export function createLog(
  message: string,
  level: LogEntry["level"] = "info"
): LogEntry {
  logCounter += 1;
  return {
    id: `log-${logCounter}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    level,
    message,
  };
}

export function logsFromApi(
  messages: string[],
  status: "success" | "error" | "warning"
): LogEntry[] {
  return messages.map((msg, idx) =>
    createLog(
      msg,
      idx === messages.length - 1 && status === "success"
        ? "success"
        : status === "error" && msg.toLowerCase().includes("error")
          ? "error"
          : "info"
    )
  );
}

export function suggestionLogs(errors: CompilerError[]): LogEntry[] {
  return errors
    .filter((e) => e.suggestion)
    .map((e) =>
      createLog(
        `[L${e.line}] Suggestion: ${e.suggestion}`,
        e.severity === "error" ? "warn" : "warn"
      )
    );
}
