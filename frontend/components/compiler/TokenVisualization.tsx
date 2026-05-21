"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Token } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeColors: Record<string, string> = {
  KEYWORD: "border-violet-500/50 bg-violet-500/10 text-violet-300",
  IDENTIFIER: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300",
  OPERATOR: "border-amber-500/50 bg-amber-500/10 text-amber-300",
  NUMBER: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  DELIMITER: "border-slate-500/50 bg-slate-500/10 text-slate-300",
  STRING: "border-pink-500/50 bg-pink-500/10 text-pink-300",
  COMMENT: "border-slate-600/50 bg-slate-600/10 text-slate-400",
};

interface TokenVisualizationProps {
  tokens: Token[];
  visible: boolean;
}

export function TokenVisualization({ tokens, visible }: TokenVisualizationProps) {
  if (!visible) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-slate-500">
        Run compile to generate tokens
      </div>
    );
  }

  return (
    <div className="max-h-48 overflow-y-auto">
      <AnimatePresence mode="popLayout">
        <div className="flex flex-wrap gap-2">
          {tokens.map((token, i) => (
            <motion.div
              key={`${token.line}-${token.column}-${i}`}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex flex-col rounded-lg border px-3 py-2 min-w-[100px]",
                typeColors[token.type] ?? typeColors.DELIMITER
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                {token.type}
              </span>
              <span className="font-mono text-sm font-medium">{token.value}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                L{token.line}:C{token.column}
              </span>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
