"use client";

import { Suspense } from "react";
import { WorkspaceInner } from "./WorkspaceInner";

export function WorkspaceClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-500">
          Loading workspace…
        </div>
      }
    >
      <WorkspaceInner />
    </Suspense>
  );
}
