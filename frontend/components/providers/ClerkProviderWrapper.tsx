"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!key) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={key}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#0f172a",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
