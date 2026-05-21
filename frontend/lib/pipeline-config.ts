import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle,
  FileCode,
  GitBranch,
  Scan,
  Tags,
} from "lucide-react";
import type { CompilerPhase } from "./types";

/** Visual pipeline steps shown in the UI (maps to existing CompilerPhase values). */
export type PipelineStepId =
  | "source"
  | "lexical"
  | "tokens"
  | "syntax"
  | "errors"
  | "output";

export type PhaseStatus = "idle" | "pending" | "active" | "complete" | "error";

export interface PipelineStepConfig {
  id: PipelineStepId;
  /** Matches backend / workspace phase id(s) */
  phaseKeys: CompilerPhase[];
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

/** Six-phase horizontal pipeline per product spec */
export const PIPELINE_STEPS: PipelineStepConfig[] = [
  {
    id: "source",
    phaseKeys: ["source"],
    label: "Source Code",
    shortLabel: "Source",
    description: "Raw input from the editor",
    icon: FileCode,
    accent: "#94a3b8",
  },
  {
    id: "lexical",
    phaseKeys: ["lexical"],
    label: "Lexical Analysis",
    shortLabel: "Lexical",
    description: "Character scanning & pattern matching",
    icon: Scan,
    accent: "#818cf8",
  },
  {
    id: "tokens",
    phaseKeys: ["tokens"],
    label: "Tokenization",
    shortLabel: "Tokens",
    description: "Token stream generation",
    icon: Tags,
    accent: "#6366f1",
  },
  {
    id: "syntax",
    phaseKeys: ["syntax", "parseTree"],
    label: "Syntax Analysis",
    shortLabel: "Syntax",
    description: "Grammar validation & parse tree",
    icon: GitBranch,
    accent: "#4f46e5",
  },
  {
    id: "errors",
    phaseKeys: ["errors"],
    label: "Error Detection",
    shortLabel: "Errors",
    description: "Diagnostics & suggestions",
    icon: AlertTriangle,
    accent: "#f59e0b",
  },
  {
    id: "output",
    phaseKeys: ["output"],
    label: "Final Output",
    shortLabel: "Output",
    description: "Compilation result",
    icon: CheckCircle,
    accent: "#22c55e",
  },
];

/** Resolve workspace phase to visual step index (0–5). */
export function getActiveStepIndex(activePhase: CompilerPhase): number {
  const idx = PIPELINE_STEPS.findIndex((step) =>
    step.phaseKeys.includes(activePhase)
  );
  return idx >= 0 ? idx : 0;
}

/** Derive per-step status from active index and compile state. */
export function getStepStatuses(
  activeIndex: number,
  isCompiling: boolean,
  compileStatus: "idle" | "compiling" | "success" | "error"
): PhaseStatus[] {
  return PIPELINE_STEPS.map((_, i) => {
    if (compileStatus === "idle" && !isCompiling) {
      return i === 0 ? "idle" : "pending";
    }
    if (i < activeIndex) return "complete";
    if (i === activeIndex) {
      if (compileStatus === "error" && !isCompiling && activeIndex >= 4) {
        return "error";
      }
      return isCompiling ? "active" : "complete";
    }
    return "pending";
  });
}

export function getProgressPercent(
  activeIndex: number,
  isCompiling: boolean,
  compileStatus: "idle" | "compiling" | "success" | "error"
): number {
  if (compileStatus === "idle" && !isCompiling) return 0;
  const base = ((activeIndex + (isCompiling ? 0.45 : 1)) / PIPELINE_STEPS.length) * 100;
  return Math.min(100, Math.round(base));
}
