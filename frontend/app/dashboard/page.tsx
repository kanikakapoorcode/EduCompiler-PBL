import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata = {
  title: "Dashboard | EduCompiler",
  description: "Your compiler history and saved sessions",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
