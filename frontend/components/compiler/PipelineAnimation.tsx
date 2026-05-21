"use client";

/**
 * @deprecated Use CompilerPipeline from ./pipeline — kept for backward compatibility.
 */
import { CompilerPipeline } from "./pipeline/CompilerPipeline";
import type { CompilerPhase } from "@/lib/types";

interface PipelineAnimationProps {
  activePhase: CompilerPhase;
  isCompiling: boolean;
  compileStatus?: "idle" | "compiling" | "success" | "error";
  tokenCount?: number;
  errorCount?: number;
}

export function PipelineAnimation(props: PipelineAnimationProps) {
  return <CompilerPipeline {...props} />;
}
