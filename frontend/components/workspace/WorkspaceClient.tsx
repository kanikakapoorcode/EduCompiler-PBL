"use client";

import { Suspense } from "react";
import { HAS_CLERK } from "@/lib/auth";
import { WorkspaceInner } from "./WorkspaceInner";
import { WorkspaceClerkBridge } from "./WorkspaceClerkBridge";

const devAuth = {
  getToken: async () => "dev" as string | null,
  isSignedIn: true,
};

export function WorkspaceClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030712] p-8 text-slate-500">
          Loading workspace…
        </div>
      }
    >
      {HAS_CLERK ? (
        <WorkspaceClerkBridge />
      ) : (
        <WorkspaceInner auth={devAuth} clerkEnabled={false} />
      )}
    </Suspense>
  );
}
