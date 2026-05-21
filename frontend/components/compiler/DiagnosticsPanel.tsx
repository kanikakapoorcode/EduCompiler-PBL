"use client";

import { ErrorPanel } from "./ErrorPanel";
import type { CompilerError } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";

interface DiagnosticsPanelProps {
  syntaxErrors: CompilerError[];
  semanticErrors?: CompilerError[];
}

export function DiagnosticsPanel({
  syntaxErrors,
  semanticErrors = [],
}: DiagnosticsPanelProps) {
  const hasSemantic = semanticErrors.length > 0;
  const hasSyntax = syntaxErrors.length > 0;

  return (
    <div className="space-y-4 max-h-[480px] overflow-y-auto">
      <GlassCard>
        <h3 className="text-xs font-medium text-slate-500 mb-3">
          SYNTAX ERRORS {hasSyntax && `(${syntaxErrors.length})`}
        </h3>
        <ErrorPanel errors={syntaxErrors} />
      </GlassCard>

      {hasSemantic && (
        <GlassCard>
          <h3 className="text-xs font-medium text-amber-500/80 mb-3">
            SEMANTIC ERRORS ({semanticErrors.length})
          </h3>
          <ErrorPanel errors={semanticErrors} />
        </GlassCard>
      )}

      {!hasSyntax && !hasSemantic && (
        <p className="text-center text-sm text-emerald-400/90 py-4">
          No syntax or semantic errors detected
        </p>
      )}
    </div>
  );
}
