"use client";

import { motion } from "framer-motion";
import { Table2, Database } from "lucide-react";
import type { SymbolTableEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SymbolTablePanelProps {
  symbols: SymbolTableEntry[];
  visible: boolean;
}

export function SymbolTablePanel({ symbols, visible }: SymbolTablePanelProps) {
  if (!visible) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-slate-500">
        Compile to build the symbol table
      </div>
    );
  }

  if (symbols.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-500">
        No symbols recorded (empty program or analysis skipped)
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-indigo-400" />
          {symbols.length} symbol{symbols.length !== 1 ? "s" : ""} in table
        </span>
      </div>

      <div className="overflow-auto max-h-[420px] rounded-lg border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-900/95 border-b border-white/10">
            <tr className="text-slate-500 uppercase tracking-wider">
              <th className="px-3 py-2 font-medium">Identifier</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Scope</th>
              <th className="px-3 py-2 font-medium">Line</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((sym, i) => (
              <motion.tr
                key={`${sym.identifier}-${sym.scope}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
                className={cn(
                  "border-b border-white/5 hover:bg-indigo-500/10 transition-colors",
                  !sym.declared && "bg-red-500/5"
                )}
              >
                <td className="px-3 py-2.5 font-mono font-medium text-cyan-300">
                  {sym.identifier}
                </td>
                <td className="px-3 py-2.5">
                  <span className="rounded bg-violet-500/20 text-violet-300 px-1.5 py-0.5">
                    {sym.type}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-slate-400">{sym.scope}</td>
                <td className="px-3 py-2.5 text-slate-500 font-mono">
                  {sym.line ?? "—"}
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={sym.status} initialized={sym.initialized} />
                </td>
                <td className="px-3 py-2.5 font-mono text-emerald-300/90 max-w-[140px] truncate">
                  {sym.assignedValue ?? "—"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  initialized,
}: {
  status?: string;
  initialized?: boolean;
}) {
  const label = status ?? (initialized ? "initialized" : "declared");
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-medium",
        label === "initialized" && "bg-emerald-500/20 text-emerald-300",
        label === "declared" && "bg-slate-500/20 text-slate-400",
        label === "used" && "bg-amber-500/20 text-amber-300",
        label === "unknown" && "bg-red-500/20 text-red-300"
      )}
    >
      {label}
    </span>
  );
}
