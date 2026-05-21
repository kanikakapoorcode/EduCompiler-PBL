"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Trash2,
  Lightbulb,
  Circle,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import type { CompilerError, LogEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ConsolePanelProps {
  logs: LogEntry[];
  status: "idle" | "compiling" | "success" | "error";
  suggestions?: CompilerError[];
  tokenCount?: number;
  onClear?: () => void;
}

const levelStyles: Record<LogEntry["level"], string> = {
  info: "text-slate-300",
  warn: "text-amber-400",
  error: "text-red-400",
  success: "text-emerald-400",
};

const LevelIcon = {
  info: Info,
  warn: AlertCircle,
  error: AlertCircle,
  success: CheckCircle2,
};

export function ConsolePanel({
  logs,
  status,
  suggestions = [],
  tokenCount,
  onClear,
}: ConsolePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const withSuggestions = suggestions.filter((s) => s.suggestion);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs, withSuggestions.length]);

  return (
    <div className="glass rounded-lg border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 bg-slate-900/40">
        <Terminal className="h-4 w-4 text-indigo-400" />
        <span className="text-xs font-semibold text-slate-300 tracking-wide">
          CONSOLE
        </span>

        {tokenCount !== undefined && tokenCount > 0 && (
          <span className="text-[10px] rounded bg-indigo-500/20 text-indigo-300 px-2 py-0.5">
            {tokenCount} tokens
          </span>
        )}

        <span
          className={cn(
            "ml-auto flex items-center gap-1.5 text-xs rounded-full px-2.5 py-0.5 font-medium",
            status === "compiling" && "bg-indigo-500/20 text-indigo-300",
            status === "success" && "bg-emerald-500/20 text-emerald-300",
            status === "error" && "bg-red-500/20 text-red-300",
            status === "idle" && "bg-slate-700/50 text-slate-400"
          )}
        >
          {status === "compiling" && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Circle className="h-2 w-2 fill-current" />
            </motion.span>
          )}
          {status === "compiling" ? "Compiling..." : status}
        </span>

        {onClear && logs.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
            title="Clear console"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="h-36 sm:h-40 overflow-y-auto p-3 font-mono text-xs space-y-1.5"
      >
        {logs.length === 0 ? (
          <p className="text-slate-600 flex items-center gap-2">
            <span className="text-indigo-500/60">›</span>
            Ready. Press Compile or Ctrl+Enter to start.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log) => {
              const Icon = LevelIcon[log.level];
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn("flex gap-2 leading-relaxed", levelStyles[log.level])}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-70" />
                  <span>
                    <span className="text-slate-600 mr-2 select-none">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    {log.message}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {withSuggestions.length > 0 && status !== "compiling" && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Lightbulb className="h-3 w-3" />
              Intelligent Suggestions
            </p>
            {withSuggestions.map((err, i) => (
              <motion.div
                key={`sug-${err.line}-${i}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-indigo-200"
              >
                <span className="text-indigo-400/80">L{err.line}: </span>
                {err.suggestion}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
