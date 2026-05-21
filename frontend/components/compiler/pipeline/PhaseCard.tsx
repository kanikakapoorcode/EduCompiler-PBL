"use client";

import { motion } from "framer-motion";
import type { PipelineStepConfig, PhaseStatus } from "@/lib/pipeline-config";
import { cn } from "@/lib/utils";

interface PhaseCardProps {
  step: PipelineStepConfig;
  status: PhaseStatus;
  index: number;
  isCompiling: boolean;
}

export function PhaseCard({
  step,
  status,
  index,
  isCompiling,
}: PhaseCardProps) {
  const Icon = step.icon;
  const isActive = status === "active";
  const isComplete = status === "complete";
  const isError = status === "error";

  return (
    <motion.div
      className={cn(
        "group relative flex flex-col items-center gap-2 rounded-xl border px-3 py-3 sm:px-4 sm:py-4 min-w-[88px] sm:min-w-[100px] transition-colors",
        isActive && "border-indigo-400/60 bg-indigo-500/15 shadow-[0_0_24px_rgba(99,102,241,0.35)]",
        isComplete && "border-emerald-500/30 bg-emerald-500/5",
        isError && "border-red-500/40 bg-red-500/10",
        status === "pending" && "border-white/10 bg-slate-900/40 opacity-50",
        status === "idle" && "border-white/10 bg-slate-900/30"
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      whileHover={{ scale: status === "pending" ? 1 : 1.02 }}
    >
      {/* Active glow ring */}
      {isActive && isCompiling && (
        <motion.span
          className="absolute inset-0 rounded-xl border border-indigo-400/50"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg border",
          isActive && "border-indigo-400 bg-indigo-500/25 text-indigo-100",
          isComplete && "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
          isError && "border-red-400 bg-red-500/20 text-red-300",
          !isActive && !isComplete && !isError && "border-white/10 bg-slate-800/80 text-slate-500"
        )}
      >
        {isActive && isCompiling && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-indigo-400/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            aria-hidden
          />
        )}
        <Icon className="h-5 w-5 relative z-10" style={{ color: isActive ? step.accent : undefined }} />
      </div>

      <div className="text-center z-10">
        <p
          className={cn(
            "text-[10px] sm:text-xs font-semibold leading-tight",
            isActive && "text-indigo-200",
            isComplete && "text-emerald-300/90",
            isError && "text-red-300",
            status === "pending" && "text-slate-500",
            status === "idle" && "text-slate-400"
          )}
        >
          {step.shortLabel}
        </p>
        <p className="hidden sm:block text-[9px] text-slate-600 mt-0.5 max-w-[90px] leading-snug">
          {step.description}
        </p>
      </div>

      {/* Status dot */}
      <span
        className={cn(
          "absolute top-2 right-2 h-1.5 w-1.5 rounded-full",
          isActive && "bg-indigo-400",
          isComplete && "bg-emerald-400",
          isError && "bg-red-400",
          status === "pending" && "bg-slate-600",
          status === "idle" && "bg-slate-700"
        )}
      />
    </motion.div>
  );
}
