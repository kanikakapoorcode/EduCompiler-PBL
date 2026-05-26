"use client";

import dynamic from "next/dynamic";

const WorkspaceClient = dynamic(
  () =>
    import("@/components/workspace/WorkspaceClient").then((m) => ({
      default: m.WorkspaceClient,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-500">
        Loading workspace…
      </div>
    ),
  }
);

export function WorkspaceLoader() {
  return <WorkspaceClient />;
}
