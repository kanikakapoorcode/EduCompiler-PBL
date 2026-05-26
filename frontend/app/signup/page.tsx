import { redirect } from "next/navigation";

/** Alias route — redirects to Clerk sign-up */
export default function SignupPage() {
  redirect("/sign-up");
}
