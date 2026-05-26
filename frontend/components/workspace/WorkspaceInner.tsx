"use client";

import { useCallback, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Home,
  Play,
  RotateCcw,
  Tags,
  Network,
  AlertCircle,
  Activity,
  Table2,
  BarChart3,
  Save,
} from "lucide-react";
import { CodeEditor } from "./CodeEditor";
import { SampleProgramPicker } from "./SampleProgramPicker";
import { CompilerPipeline } from "@/components/compiler/pipeline";
import { TokenVisualization } from "@/components/compiler/TokenVisualization";
import { ParseTreeView } from "@/components/compiler/ParseTreeView";
import { DiagnosticsPanel } from "@/components/compiler/DiagnosticsPanel";
import { SymbolTablePanel } from "@/components/compiler/SymbolTablePanel";
import { AnalysisDashboard } from "@/components/compiler/AnalysisDashboard";
import { ConsolePanel } from "@/components/compiler/ConsolePanel";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { compileCode } from "@/lib/api";
import { DEFAULT_SAMPLE_CODE } from "@/lib/code-samples";
import {
  createLog,
  logsFromApi,
  PHASE_LOG_MESSAGES,
  suggestionLogs,
} from "@/lib/compile-helpers";
import { saveCompilation, fetchSession } from "@/lib/sessions-api";
import { getSessionToken, authRequiredMessage } from "@/lib/auth";
import type { CompileResponse, CompilerPhase, LogEntry } from "@/lib/types";

export type WorkspaceAuth = {
  getToken: () => Promise<string | null>;
  isSignedIn: boolean;
};

type TabId =
  | "pipeline"
  | "analysis"
  | "tokens"
  | "symbols"
  | "tree"
  | "errors";

const PHASE_SEQUENCE: CompilerPhase[] = [
  "source",
  "lexical",
  "tokens",
  "syntax",
  "parseTree",
  "errors",
  "output",
];

const PHASE_MS = 350;

type WorkspaceInnerProps = {};

export function WorkspaceInner({}: WorkspaceInnerProps) {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(DEFAULT_SAMPLE_CODE);
  const [result, setResult] = useState<CompileResponse | null>(null);
  const [activePhase, setActivePhase] = useState<CompilerPhase>("source");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<
    "idle" | "compiling" | "success" | "error"
  >("idle");
  const [activeTab, setActiveTab] = useState<TabId>("pipeline");
  const [isCompiling, setIsCompiling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const appendLog = useCallback((entry: LogEntry) => {
    setLogs((prev) => [...prev, entry]);
  }, []);

  const allDiagnostics = [
    ...(result?.errors ?? []),
    ...(result?.semanticErrors ?? []),
  ];

  const runCompile = useCallback(async () => {
    setIsCompiling(true);
    setStatus("compiling");
    setResult(null);
    setLogs([createLog("Compilation pipeline initiated", "info")]);

    for (const phase of PHASE_SEQUENCE) {
      setActivePhase(phase);
      appendLog(createLog(PHASE_LOG_MESSAGES[phase], "info"));
      await new Promise((r) => setTimeout(r, PHASE_MS));
    }

    try {
      const response = await compileCode(code);
      setResult(response);
      setActivePhase(response.phase);

      const hasErrors =
        response.errors.length > 0 ||
        (response.semanticErrors?.length ?? 0) > 0;
      setStatus(response.status === "success" ? "success" : "error");

      setLogs((prev) => [
        ...prev,
        ...logsFromApi(response.logs, response.status),
        ...suggestionLogs([
          ...response.errors,
          ...(response.semanticErrors ?? []),
        ]),
        createLog(
          hasErrors
            ? `Found ${response.errors.length} syntax + ${response.semanticErrors?.length ?? 0} semantic issue(s)`
            : `${response.tokens.length} tokens · ${response.symbolTable?.length ?? 0} symbols · parse tree ready`,
          hasErrors ? "error" : "success"
        ),
      ]);

      if (hasErrors) setActiveTab("errors");
      else if ((response.symbolTable?.length ?? 0) > 5) setActiveTab("symbols");
      else if (response.tokens.length > 20) setActiveTab("analysis");
      else setActiveTab("tokens");
    } catch {
      setStatus("error");
      appendLog(
        createLog("Compilation failed — is the backend running on :8000?", "error")
      );
    } finally {
      setIsCompiling(false);
    }
  }, [code, appendLog]);

  const reset = () => {
    setCode(DEFAULT_SAMPLE_CODE);
    setResult(null);
    setActivePhase("source");
    setLogs([]);
    setStatus("idle");
    setIsCompiling(false);
    setActiveTab("pipeline");
  };

  const clearConsole = () => setLogs([]);

  const handleSave = async () => {
    if (!result) {
      setSaveMsg("Compile first, then save");
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const token = "dev";
      await saveCompilation(token, {
        source_code: code,
        tokens: result.tokens,
        errors: [...result.errors, ...(result.semanticErrors ?? [])],
        syntax_status: result.status,
      });
      setSaveMsg("Saved to history");
      appendLog(createLog("Session saved to database", "success"));
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (!sessionId) return;

    (async () => {
      try {
        const token = "dev";
        const session = await fetchSession(token, sessionId);
        setCode(session.source_code);
        setLogs([createLog(`Loaded saved session ${sessionId}`, "info")]);
      } catch {
        setLogs([createLog("Could not load saved session", "error")]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isCompiling) runCompile();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCompiling, runCompile]);

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "pipeline", label: "Pipeline", icon: Activity },
    { id: "analysis", label: "Overview", icon: BarChart3 },
    { id: "tokens", label: "Tokens", icon: Tags },
    { id: "symbols", label: "Symbols", icon: Table2 },
    { id: "tree", label: "Parse Tree", icon: Network },
    { id: "errors", label: "Diagnostics", icon: AlertCircle },
  ];

  const issueCount = allDiagnostics.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#030712]">
      <header className="relative z-50 glass-strong flex items-center justify-between gap-4 px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white"
          >
            <Home className="h-4 w-4" />
          </Link>
          <Cpu className="h-6 w-6 text-indigo-400" />
          <span className="font-semibold hidden sm:inline">
            Edu<span className="text-indigo-400">Compiler</span> Workspace
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className="text-[10px] text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">
            Local Workspace
          </span>
          <Button href="/dashboard" variant="ghost" className="!px-3 !py-2">
            <span className="text-xs">History</span>
          </Button>
          <SampleProgramPicker onSelect={setCode} disabled={isCompiling} />
          <span className="hidden md:inline text-[10px] text-slate-600">
            Ctrl+Enter
          </span>
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={isCompiling || saving || !result}
            className="!px-3 !py-2"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">
              {saving ? "Saving…" : "Save"}
            </span>
          </Button>
          {saveMsg && (
            <span className="text-[10px] text-indigo-300 max-w-[120px] truncate">
              {saveMsg}
            </span>
          )}
          <Button variant="ghost" onClick={reset} className="!px-3 !py-2">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            variant="primary"
            onClick={runCompile}
            disabled={isCompiling}
            className="!px-4 !py-2"
          >
            <Play className="h-4 w-4" />
            {isCompiling ? "Compiling..." : "Compile"}
          </Button>
        </div>
      </header>

      <div className="relative z-0 flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
        <section className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 lg:w-1/2 min-h-[360px]">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-slate-900/50 flex-wrap">
            <span className="text-xs font-medium text-slate-500">SOURCE</span>
            <span className="text-xs text-slate-600">
              {code.split("\n").length} lines
            </span>
            {issueCount > 0 && (
              <span className="ml-auto text-[10px] text-red-400">
                {issueCount} issue(s)
              </span>
            )}
          </div>
          <div className="flex-1 min-h-[320px] p-2">
            <CodeEditor
              value={code}
              onChange={setCode}
              errors={allDiagnostics.map((e) => ({
                line: e.line,
                message: e.message,
              }))}
            />
          </div>
        </section>

        <section className="flex flex-col flex-1 min-h-0 lg:w-1/2">
          <div className="flex border-b border-white/10 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-indigo-300 border-b-2 border-indigo-500 bg-indigo-500/10"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.id === "errors" && issueCount > 0 && (
                  <span className="rounded-full bg-red-500/80 text-white text-[10px] px-1.5 min-w-[18px]">
                    {issueCount}
                  </span>
                )}
                {tab.id === "symbols" &&
                  result &&
                  (result.symbolTable?.length ?? 0) > 0 && (
                    <span className="rounded-full bg-cyan-500/80 text-white text-[10px] px-1.5">
                      {result.symbolTable!.length}
                    </span>
                  )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {activeTab === "pipeline" && (
                <motion.div
                  key="pipeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <GlassCard glow={isCompiling}>
                    <h3 className="text-xs font-medium text-slate-500 mb-3">
                      COMPILER PIPELINE
                    </h3>
                    <CompilerPipeline
                      activePhase={activePhase}
                      isCompiling={isCompiling}
                      compileStatus={status}
                      tokenCount={result?.tokens.length}
                      errorCount={issueCount}
                    />
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "analysis" && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AnalysisDashboard result={result} isCompiling={isCompiling} />
                </motion.div>
              )}

              {activeTab === "tokens" && (
                <motion.div
                  key="tokens"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <GlassCard>
                    <h3 className="text-xs font-medium text-slate-500 mb-3">
                      TOKEN STREAM
                      {result && (
                        <span className="ml-2 text-indigo-400">
                          ({result.tokens.length})
                        </span>
                      )}
                    </h3>
                    <TokenVisualization
                      tokens={result?.tokens ?? []}
                      visible={!!result}
                    />
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "symbols" && (
                <motion.div
                  key="symbols"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <GlassCard>
                    <h3 className="text-xs font-medium text-slate-500 mb-3">
                      SYMBOL TABLE
                    </h3>
                    <SymbolTablePanel
                      symbols={result?.symbolTable ?? []}
                      visible={!!result}
                    />
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "tree" && (
                <motion.div
                  key="tree"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <GlassCard className="!p-2">
                    <h3 className="text-xs font-medium text-slate-500 mb-2 px-2">
                      PARSE TREE
                    </h3>
                    <ParseTreeView
                      tree={result?.parseTree ?? null}
                      tokens={result?.tokens ?? []}
                      visible={!!result}
                    />
                  </GlassCard>
                </motion.div>
              )}

              {activeTab === "errors" && (
                <motion.div
                  key="errors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <DiagnosticsPanel
                    syntaxErrors={result?.errors ?? []}
                    semanticErrors={result?.semanticErrors}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <div className="shrink-0 p-2 sm:p-4">
        <ConsolePanel
          logs={logs}
          status={status}
          suggestions={allDiagnostics}
          tokenCount={result?.tokens.length}
          onClear={clearConsole}
        />
      </div>
    </div>
  );
}
