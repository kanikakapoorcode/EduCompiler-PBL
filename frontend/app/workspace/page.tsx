import { WorkspaceLoader } from "@/components/workspace/WorkspaceLoader";

export const metadata = {
  title: "Workspace | EduCompiler",
  description: "Interactive compiler visualization workspace",
};

export default function WorkspacePage() {
  return <WorkspaceLoader />;
}
