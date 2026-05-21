import { WorkspaceClient } from "@/components/workspace/WorkspaceClient";

export const metadata = {
  title: "Workspace | EduCompiler",
  description: "Interactive compiler visualization workspace",
};

export default function WorkspacePage() {
  return <WorkspaceClient />;
}
