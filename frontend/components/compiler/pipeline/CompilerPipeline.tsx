"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Info } from "lucide-react";
import type { CompilerPhase } from "@/lib/types";
import {
  getActiveStepIndex,
  getProgressPercent,
  getStepStatuses,
  PIPELINE_STEPS,
} from "@/lib/pipeline-config";
import { PipelineAnimator } from "./PipelineAnimator";
import { PhaseCard } from "./PhaseCard";
import { PipelineConnector } from "./PipelineConnector";
import { cn } from "@/lib/utils";

export interface CompilerPipelineProps {
  /** Current phase from workspace compile loop (unchanged API contract) */
  activePhase: CompilerPhase;
  isCompiling: boolean;
  compileStatus?: "idle" | "compiling" | "success" | "error";
  /** Optional metrics — safe to omit; UI shows fallbacks */
  tokenCount?: number;
  errorCount?: number;
  className?: string;
}

/**
 * Real-time modular compiler pipeline visualization.
 * Driven by existing workspace state — no backend changes required.
 */
export function CompilerPipeline({
  activePhase,
  isCompiling,
  compileStatus = "idle",
  tokenCount,
  errorCount,
  className,
}: CompilerPipelineProps) {
  const activeIndex = useMemo(
    () => getActiveStepIndex(activePhase),
    [activePhase]
  );

  const statuses = useMemo(
    () => getStepStatuses(activeIndex, isCompiling, compileStatus),
    [activeIndex, isCompiling, compileStatus]
  );

  const progress = useMemo(
    () => getProgressPercent(activeIndex, isCompiling, compileStatus),
    [activeIndex, isCompiling, compileStatus]
  );

  const activeStep = PIPELINE_STEPS[activeIndex];
  const showFallback = compileStatus === "idle" && !isCompiling && !tokenCount;

  return (
    <div className={cn("w-full", className)}>
      <PipelineAnimator
        progress={progress}
        isCompiling={isCompiling}
        activeStepLabel={isCompiling ? activeStep?.label : undefined}
      >
        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-stretch justify-start gap-0 overflow-x-auto pb-2 scrollbar-thin">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center shrink-0">
              <PhaseCard
                step={step}
                status={statuses[i]}
                index={i}
                isCompiling={isCompiling}
              />
              {i < PIPELINE_STEPS.length - 1 && (
                <PipelineConnector
                  fromStatus={statuses[i]}
                  toStatus={statuses[i + 1]}
                  isCompiling={isCompiling}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical stack with ↓ flow */}
        <div className="flex md:hidden flex-col items-center gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center w-full max-w-[200px]">
              <PhaseCard
                step={step}
                status={statuses[i]}
                index={i}
                isCompiling={isCompiling}
              />
              {i < PIPELINE_STEPS.length - 1 && (
                <PipelineConnector
                  fromStatus={statuses[i]}
                  toStatus={statuses[i + 1]}
                  isCompiling={isCompiling}
                  orientation="vertical"
                />
              )}
            </div>
          ))}
        </div>
      </PipelineAnimator>

      {/* Metrics row — uses mock/API data when available */}
      <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
        <MetricPill
          icon={Activity}
          label="Tokens"
          value={tokenCount !== undefined ? String(tokenCount) : "—"}
        />
        <MetricPill
          icon={Info}
          label="Errors"
          value={errorCount !== undefined ? String(errorCount) : "—"}
          variant={errorCount && errorCount > 0 ? "error" : "default"}
        />
        <MetricPill
          label="Phase"
          value={activeStep?.label ?? "Source Code"}
          highlight
        />
      </div>

      {/* Fallback when idle — no compile run yet */}
      {showFallback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 rounded-lg border border-dashed border-white/10 bg-slate-900/30 px-3 py-2 text-xs text-slate-500 text-center"
        >
          Press <span className="text-indigo-400 font-medium">Compile</span> or{" "}
          <span className="text-indigo-400 font-medium">Ctrl+Enter</span> to run the
          pipeline visualization
        </motion.div>
      )}
    </div>
  );
}

function MetricPill({
  label,
  value,
  icon: Icon,
  variant = "default",
  highlight,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
  variant?: "default" | "error";
  highlight?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1",
        variant === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-white/10 bg-slate-800/50 text-slate-400",
        highlight && "border-indigo-500/30 text-indigo-300"
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span className="text-slate-600">{label}:</span>
      <span className="font-mono font-medium">{value}</span>
    </span>
  );
}
