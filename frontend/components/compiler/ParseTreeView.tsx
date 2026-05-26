"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Network,
  ChevronRight,
  Zap,
  GitBranch,
} from "lucide-react";
import type { ParseTreeNode, Token } from "@/lib/types";
import { buildParseTreeSteps, type ParseBuildStep } from "@/lib/parse-tree-steps";
import {
  computeTreeLayout,
  NODE_W,
  NODE_H,
} from "@/lib/parse-tree-layout";
import { cn } from "@/lib/utils";

const SPEEDS = [
  { label: "0.5×", ms: 1200 },
  { label: "1×", ms: 700 },
  { label: "1.5×", ms: 450 },
] as const;

const typeColors: Record<string, string> = {
  KEYWORD: "border-violet-500/60 bg-violet-500/15 text-violet-200",
  IDENTIFIER: "border-cyan-500/60 bg-cyan-500/15 text-cyan-200",
  OPERATOR: "border-amber-500/60 bg-amber-500/15 text-amber-200",
  NUMBER: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200",
  DELIMITER: "border-slate-500/50 bg-slate-500/10 text-slate-300",
  STRING: "border-pink-500/60 bg-pink-500/15 text-pink-200",
  COMMENT: "border-slate-600/50 bg-slate-600/10 text-slate-400",
};

const phaseStyles: Record<ParseBuildStep["phase"], string> = {
  ready: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  token: "bg-amber-500/15 text-amber-200 border-amber-500/30",
  structure: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
};

function ParseTreeTokenStrip({
  tokens,
  step,
}: {
  tokens: Token[];
  step: ParseBuildStep | null;
}) {
  const consumed = new Set(step?.consumedTokenIndices ?? []);
  const active = new Set(step?.activeTokenIndices ?? []);
  const readIndex = step?.consumedTokenIndices.length ?? 0;

  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Token stream
        </p>
        <span className="text-[10px] font-mono text-slate-600">
          read {readIndex}/{tokens.length}
        </span>
      </div>

      <div className="relative">
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pb-1">
          {tokens.map((token, i) => {
            const isActive = active.has(i);
            const isConsumed = consumed.has(i) && !isActive;
            const isNext =
              !isConsumed &&
              !isActive &&
              i === readIndex &&
              step?.phase !== "ready";

            return (
              <motion.div
                key={`${token.line}-${token.column}-${i}`}
                layout
                initial={false}
                animate={{
                  opacity: isConsumed ? 0.3 : 1,
                  scale: isActive ? 1.08 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative flex flex-col rounded-lg border px-2.5 py-1.5 min-w-[76px]",
                  typeColors[token.type] ?? typeColors.DELIMITER,
                  isActive &&
                    "shadow-[0_0_20px_rgba(251,191,36,0.35)] border-amber-400/70 z-10",
                  isNext && "border-dashed border-indigo-400/50",
                  isConsumed && "grayscale-[0.5]"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="token-cursor"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="text-[9px] uppercase tracking-wide opacity-70">
                  {token.type}
                </span>
                <span className="font-mono text-sm font-bold">{token.value}</span>
                <span className="text-[9px] text-slate-500">
                  L{token.line}:C{token.column}
                </span>
              </motion.div>
            );
          })}
        </div>
        {tokens.length > 0 && (
          <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(readIndex / tokens.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ParseTreeGraph({
  tree,
  visibleIds,
  highlightId,
}: {
  tree: ParseTreeNode;
  visibleIds: Set<string>;
  highlightId: string | null;
}) {
  const { nodes, edges, width, height } = useMemo(
    () => computeTreeLayout(tree, visibleIds),
    [tree, visibleIds]
  );

  if (visibleIds.size === 0) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-slate-600">
        <GitBranch className="h-8 w-8 mr-2 opacity-40" />
        Tree grows as each token is parsed…
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-auto rounded-lg bg-[#020617]/60 min-h-[280px] max-h-[400px]">
      <div
        className="relative mx-auto"
        style={{ width: Math.min(width, 900), height, minWidth: 280 }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          width={width}
          height={height}
          style={{ overflow: "visible" }}
        >
          {edges.map((e) => (
            <motion.path
              key={e.id}
              d={`M ${e.x1} ${e.y1} C ${e.x1} ${(e.y1 + e.y2) / 2}, ${e.x2} ${(e.y1 + e.y2) / 2}, ${e.x2} ${e.y2}`}
              fill="none"
              stroke="url(#edgeGrad)"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          ))}
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
            </linearGradient>
          </defs>
        </svg>

        <AnimatePresence>
          {nodes.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.7, y: n.y - 12 }}
              animate={{ opacity: 1, scale: 1, y: n.y }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={cn(
                "absolute flex items-center justify-center text-center rounded-lg border px-2 py-2 text-[11px] font-medium leading-tight",
                n.isLeaf
                  ? "bg-cyan-950/80 border-cyan-500/40 text-cyan-100"
                  : "bg-slate-900/90 border-indigo-500/50 text-slate-100",
                n.id === highlightId &&
                  "ring-2 ring-amber-400/90 shadow-[0_0_24px_rgba(251,191,36,0.25)] z-10"
              )}
              style={{
                left: n.x,
                top: n.y,
                width: NODE_W,
                minHeight: NODE_H,
              }}
            >
              {n.label}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ParseTreeViewProps {
  tree: ParseTreeNode | null;
  tokens: Token[];
  visible: boolean;
}

export function ParseTreeView({ tree, tokens, visible }: ParseTreeViewProps) {
  const steps = useMemo(
    () => (tree && tokens.length ? buildParseTreeSteps(tree, tokens) : []),
    [tree, tokens]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);

  const stepMs = SPEEDS[speedIdx].ms;

  const reset = useCallback(() => {
    setStepIndex(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    reset();
  }, [tree, tokens, reset]);

  useEffect(() => {
    if (!playing || steps.length === 0) return;
    if (stepIndex >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), stepMs);
    return () => clearTimeout(t);
  }, [playing, stepIndex, steps.length, stepMs]);

  const currentStep = steps[stepIndex] ?? null;
  const highlightNodeId = currentStep?.nodeId ?? null;

  const visibleIds = useMemo(() => {
    if (!currentStep) return new Set<string>();
    return new Set(currentStep.visibleNodeIds);
  }, [currentStep]);

  const progress =
    steps.length > 1 ? Math.round((stepIndex / (steps.length - 1)) * 100) : 0;

  const goNext = () =>
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));

  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0));

  if (!visible || !tree) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Parse tree will appear after syntax analysis
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
            <Network className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-300">
              Parse tree builder
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              step {stepIndex + 1} / {steps.length}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex rounded-lg border border-white/10 overflow-hidden mr-1">
            {SPEEDS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSpeedIdx(i)}
                className={cn(
                  "px-2 py-1 text-[10px] font-medium transition-colors",
                  speedIdx === i
                    ? "bg-indigo-500/30 text-indigo-200"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="rounded-lg px-2 py-1.5 text-[10px] text-slate-400 hover:bg-white/10 disabled:opacity-30"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            disabled={steps.length === 0 || stepIndex >= steps.length - 1}
            className="rounded-lg p-2 bg-indigo-600/80 text-white hover:bg-indigo-500 disabled:opacity-40"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={stepIndex >= steps.length - 1}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 disabled:opacity-40"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-indigo-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      {tokens.length > 0 && (
        <ParseTreeTokenStrip tokens={tokens} step={currentStep} />
      )}

      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2.5"
          >
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase border",
                phaseStyles[currentStep.phase]
              )}
            >
              {currentStep.phase}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
            <span className="text-xs text-slate-300 leading-relaxed">
              {currentStep.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <ParseTreeGraph
          tree={tree}
          visibleIds={visibleIds}
          highlightId={highlightNodeId}
        />
      </div>

      {stepIndex === 0 && steps.length > 2 && (
        <p className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600">
          <Zap className="h-3 w-3" />
          Press Play to animate tokens building the parse tree
        </p>
      )}
    </div>
  );
}
