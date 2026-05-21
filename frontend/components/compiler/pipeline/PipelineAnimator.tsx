"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PipelineAnimatorProps {
  /** 0–100 overall pipeline progress */
  progress: number;
  isCompiling: boolean;
  activeStepLabel?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps the pipeline row with a top progress bar and optional active-phase label.
 * Lightweight: only animates width + opacity (GPU-friendly).
 */
export function PipelineAnimator({
  progress,
  isCompiling,
  activeStepLabel,
  children,
  className,
}: PipelineAnimatorProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Global progress track */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500">
          <span>Pipeline progress</span>
          <span className="font-mono text-indigo-400/90">{progress}%</span>
        </div>
        <div className="relative h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-400"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
          {isCompiling && (
            <motion.div
              className="absolute top-0 h-1.5 w-12 rounded-full bg-white/25"
              style={{ left: `${Math.max(0, progress - 10)}%` }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
        {activeStepLabel && isCompiling && (
          <motion.p
            key={activeStepLabel}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-indigo-300/90 font-medium"
          >
            Processing: {activeStepLabel}
          </motion.p>
        )}
      </div>

      {/* Phase cards row */}
      <div className="relative">{children}</div>

      {/* Subtle ambient gradient while compiling */}
      {isCompiling && (
        <motion.div
          className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          aria-hidden
        />
      )}
    </div>
  );
}
