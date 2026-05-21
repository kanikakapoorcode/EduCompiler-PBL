"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Lightbulb, XCircle } from "lucide-react";
import type { CompilerError } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";

interface ErrorPanelProps {
  errors: CompilerError[];
}

export function ErrorPanel({ errors }: ErrorPanelProps) {
  if (errors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300"
      >
        <span className="text-sm">No syntax errors detected</span>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3 max-h-48 overflow-y-auto">
      <AnimatePresence>
        {errors.map((err, i) => (
          <motion.div
            key={`${err.line}-${err.column}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard
              className={
                err.severity === "error"
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-amber-500/30 bg-amber-500/5"
              }
            >
              <div className="flex gap-3">
                {err.severity === "error" ? (
                  <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    Line {err.line}, Column {err.column}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">{err.message}</p>
                  {err.suggestion && (
                    <div className="mt-3 flex gap-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3">
                      <Lightbulb className="h-4 w-4 text-indigo-400 shrink-0" />
                      <p className="text-xs text-indigo-200">{err.suggestion}</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
