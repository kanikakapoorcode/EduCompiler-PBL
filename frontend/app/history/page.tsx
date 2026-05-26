import { redirect } from "next/navigation";

/** Saved compiler history — served by the dashboard */
export default function HistoryPage() {
  redirect("/dashboard");
}
