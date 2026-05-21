"use client";

import { motion } from "framer-motion";
import {
  Tags,
  Table2,
  AlertTriangle,
  Brain,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { CompileResponse } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";

interface AnalysisDashboardProps {
  result: CompileResponse | null;
  isCompiling: boolean;
}

export function AnalysisDashboard({ result, isCompiling }: AnalysisDashboardProps) {
  if (!result && !isCompiling) {
    return (
      <GlassCard className="text-center py-12">
        <p className="text-slate-500 text-sm">
          Run <span className="text-indigo-400">Compile</span> on a sample program to
          see full analysis stats here.
        </p>
      </GlassCard>
    );
  }

  const tokenCount = result?.tokens.length ?? 0;
  const symbolCount = result?.symbolTable?.length ?? 0;
  const syntaxErrors = result?.errors.length ?? 0;
  const semanticErrors = result?.semanticErrors?.length ?? 0;
  const totalIssues = syntaxErrors + semanticErrors;
  const ok = result?.status === "success";

  const cards = [
    {
      label: "Tokens",
      value: isCompiling ? "…" : tokenCount,
      icon: Tags,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Symbols",
      value: isCompiling ? "…" : symbolCount,
      icon: Table2,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Syntax",
      value: isCompiling ? "…" : syntaxErrors,
      icon: AlertTriangle,
      color: syntaxErrors ? "text-red-400" : "text-emerald-400",
      bg: syntaxErrors ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Semantic",
      value: isCompiling ? "…" : semanticErrors,
      icon: Brain,
      color: semanticErrors ? "text-amber-400" : "text-emerald-400",
      bg: semanticErrors ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard className={`!p-4 border ${c.bg}`}>
              <c.icon className={`h-5 w-5 mb-2 ${c.color}`} />
              <p className="text-2xl font-bold text-white tabular-nums">{c.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">
                {c.label}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {result && (
        <GlassCard>
          <div className="flex items-center gap-3">
            {ok ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="h-8 w-8 text-red-400 shrink-0" />
            )}
            <div>
              <p className="text-sm font-semibold text-white">
                Compilation {result.status.toUpperCase()}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Phase: {result.phase} · {totalIssues} total issue
                {totalIssues !== 1 ? "s" : ""} · {result.logs.length} log entries
              </p>
              <p className="text-xs text-slate-500 mt-2 font-mono line-clamp-2">
                {result.logs[result.logs.length - 1]}
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
