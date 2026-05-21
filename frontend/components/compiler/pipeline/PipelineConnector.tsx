"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhaseStatus } from "@/lib/pipeline-config";

interface PipelineConnectorProps {
  fromStatus: PhaseStatus;
  toStatus: PhaseStatus;
  isCompiling: boolean;
  orientation?: "horizontal" | "vertical";
}

/** Animated arrow / line between two phase cards */
export function PipelineConnector({
  fromStatus,
  toStatus,
  isCompiling,
  orientation = "horizontal",
}: PipelineConnectorProps) {
  const filled =
    fromStatus === "complete" ||
    fromStatus === "active" ||
    toStatus === "active" ||
    toStatus === "complete";

  if (orientation === "vertical") {
    return (
      <div className="flex flex-col items-center py-1">
        <motion.div
          className={cn(
            "w-px h-4 bg-slate-700 relative overflow-hidden",
            filled && "bg-indigo-500/50"
          )}
        >
          {filled && isCompiling && (
            <motion.div
              className="absolute left-0 w-full h-2 bg-indigo-400"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.div>
        <ChevronDown
          className={cn(
            "h-3 w-3 -mt-0.5",
            filled ? "text-indigo-400" : "text-slate-600"
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center px-0.5 sm:px-1 shrink-0">
      <div className="relative w-4 sm:w-8 h-px bg-slate-700 overflow-hidden rounded">
        {filled && (
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        )}
        {filled && isCompiling && toStatus === "active" && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-indigo-200 shadow-[0_0_6px_#818cf8]"
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
      <span
        className={cn(
          "text-slate-600 text-[10px] mx-0.5 hidden sm:inline",
          filled && "text-indigo-500/70"
        )}
      >
        →
      </span>
    </div>
  );
}
