import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

const clerkAppearance = {
  elements: {
    rootBox: "mx-auto",
    card: "glass-strong shadow-2xl border border-white/10",
    headerTitle: "text-white",
    headerSubtitle: "text-slate-400",
    formButtonPrimary:
      "bg-indigo-600 hover:bg-indigo-500 transition-colors",
    footerActionLink: "text-indigo-400 hover:text-indigo-300",
  },
};

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <AuthPageShell
        title="Sign in"
        subtitle="Clerk is not configured for this environment"
      >
        <div className="glass-strong rounded-xl p-8 max-w-md text-center space-y-4">
          <p className="text-slate-400 text-sm">
            Add Clerk keys to <code className="text-indigo-400">.env.local</code>{" "}
            (see <code className="text-indigo-400">.env.local.example</code>), or set{" "}
            <code className="text-indigo-400">AUTH_DISABLED=true</code> on the backend
            for local testing.
          </p>
          <Link
            href="/workspace"
            className="inline-block text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Continue to workspace →
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Welcome back"
      subtitle="Sign in to access your compiler workspace and saved sessions"
    >
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </AuthPageShell>
  );
}
