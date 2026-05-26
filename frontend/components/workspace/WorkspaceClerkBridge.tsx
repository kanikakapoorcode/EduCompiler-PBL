"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WorkspaceInner } from "./WorkspaceInner";

export function WorkspaceClerkBridge() {
  const { getToken, isSignedIn } = useAuth();

  const authToolbar = isSignedIn ? (
    <>
      <Button href="/dashboard" variant="ghost" className="!px-3 !py-2">
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Button>
      <UserButton />
    </>
  ) : (
    <Button href="/sign-in" variant="secondary" className="!px-3 !py-2">
      <span className="text-xs">Sign in to save</span>
    </Button>
  );

  return (
    <WorkspaceInner
      auth={{ getToken, isSignedIn: !!isSignedIn }}
      authToolbar={authToolbar}
      clerkEnabled
    />
  );
}
