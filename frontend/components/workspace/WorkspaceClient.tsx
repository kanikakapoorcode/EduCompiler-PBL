"use client";

import { Suspense } from "react";
import { WorkspaceInner } from "./WorkspaceInner";

const devAuth = {
  getToken: async () => "dev" as string | null,
  isSignedIn: true,
};

export function WorkspaceClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-500">
          Loading workspace…
        </div>
      }
    >
      <WorkspaceInner auth={devAuth} />
    </Suspense>
  );
}
