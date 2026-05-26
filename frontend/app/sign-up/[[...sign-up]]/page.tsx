import { SignUp } from "@clerk/nextjs";
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

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <AuthPageShell
        title="Create account"
        subtitle="Clerk is not configured for this environment"
      >
        <div className="glass-strong rounded-xl p-8 max-w-md text-center space-y-4">
          <p className="text-slate-400 text-sm">
            Copy <code className="text-indigo-400">.env.local.example</code> to{" "}
            <code className="text-indigo-400">.env.local</code> and add your Clerk
            publishable key.
          </p>
          <Link
            href="/workspace"
            className="inline-block text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Open workspace →
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Join EduCompiler"
      subtitle="Create an account to save compilations and track your learning progress"
    >
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
      />
    </AuthPageShell>
  );
}
