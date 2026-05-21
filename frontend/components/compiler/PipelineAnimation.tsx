"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  FileCode,
  GitBranch,
  Network,
  Scan,
  Tags,
} from "lucide-react";
import type { CompilerPhase } from "@/lib/types";
import { cn } from "@/lib/utils";

const phases: { id: CompilerPhase; label: string; icon: React.ElementType }[] = [
  { id: "source", label: "Source", icon: FileCode },
  { id: "lexical", label: "Lexical", icon: Scan },
  { id: "tokens", label: "Tokens", icon: Tags },
  { id: "syntax", label: "Syntax", icon: GitBranch },
  { id: "parseTree", label: "Parse Tree", icon: Network },
  { id: "errors", label: "Errors", icon: AlertTriangle },
  { id: "output", label: "Output", icon: CheckCircle },
];

interface PipelineAnimationProps {
  activePhase: CompilerPhase;
  isCompiling: boolean;
}

export function PipelineAnimation({
  activePhase,
  isCompiling,
}: PipelineAnimationProps) {
  const activeIndex = phases.findIndex((p) => p.id === activePhase);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-1 px-1">
        {phases.map((phase, i) => {
          const Icon = phase.icon;
          const isActive = phase.id === activePhase;
          const isPast = i < activeIndex;

          return (
            <div key={phase.id} className="flex items-center">
              <motion.div
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-2 py-2 transition-all",
                  isActive && "glow-accent bg-indigo-500/20",
                  isPast && !isActive && "opacity-70",
                  !isActive && !isPast && "opacity-40"
                )}
                animate={
                  isActive && isCompiling
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border",
                    isActive
                      ? "border-indigo-400 bg-indigo-500/30 text-indigo-200"
                      : "border-white/10 bg-slate-900/80 text-slate-500"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                  {phase.label}
                </span>
              </motion.div>

              {i < phases.length - 1 && (
                <motion.div
                  className="mx-0.5 h-px w-4 sm:w-6 bg-slate-700 relative overflow-hidden"
                >
                  {(isPast || isActive) && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-indigo-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  {isActive && isCompiling && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-indigo-300"
                      animate={{ left: ["0%", "100%"] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
