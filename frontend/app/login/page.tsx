import { redirect } from "next/navigation";

/** Alias route — redirects to Clerk sign-in */
export default function LoginPage() {
  redirect("/sign-in");
}
