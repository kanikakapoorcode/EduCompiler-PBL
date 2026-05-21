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

const phases = [
  { label: "Source Code", icon: FileCode, color: "#94a3b8" },
  { label: "Lexical Analysis", icon: Scan, color: "#818cf8" },
  { label: "Token Generation", icon: Tags, color: "#6366f1" },
  { label: "Syntax Analysis", icon: GitBranch, color: "#4f46e5" },
  { label: "Parse Tree", icon: Network, color: "#7c3aed" },
  { label: "Error Detection", icon: AlertTriangle, color: "#f59e0b" },
  { label: "Final Output", icon: CheckCircle, color: "#22c55e" },
];

export function CompilerFlowViz() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl glass-strong p-6 sm:p-8">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0">
        {phases.map((phase, i) => {
          const Icon = phase.icon;
          return (
            <div key={phase.label} className="flex items-center">
              <motion.div
                className="flex flex-col items-center gap-2 px-3 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80"
                  animate={{
                    boxShadow: [
                      `0 0 0px ${phase.color}00`,
                      `0 0 20px ${phase.color}66`,
                      `0 0 0px ${phase.color}00`,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: phase.color }} />
                </motion.div>
                <span className="text-center text-xs font-medium text-slate-400 sm:max-w-[90px]">
                  {phase.label}
                </span>
              </motion.div>

              {i < phases.length - 1 && (
                <motion.div
                  className="hidden h-0.5 w-8 bg-gradient-to-r from-indigo-500/50 to-transparent sm:block lg:w-12"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.15 + 0.2 }}
                >
                  <motion.div
                    className="h-full w-2 rounded-full bg-indigo-400"
                    animate={{ x: [0, 32, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                </motion.div>
              )}

              {i < phases.length - 1 && (
                <motion.div
                  className="h-6 w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent sm:hidden"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>
          );
        })}
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}
