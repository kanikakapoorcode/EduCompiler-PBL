/**
 * Modular auth helpers — isolated from compiler API logic.
 */

export const HAS_CLERK = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Resolve Bearer token for session APIs.
 * - With Clerk: requires signed-in user (returns null if not signed in)
 * - Without Clerk: uses dev token when backend AUTH_DISABLED=true
 */
export async function getSessionToken(
  getToken: () => Promise<string | null>,
  isSignedIn: boolean
): Promise<string | null> {
  if (HAS_CLERK) {
    if (!isSignedIn) return null;
    return getToken();
  }
  return "dev";
}

export function authRequiredMessage(): string {
  return HAS_CLERK
    ? "Sign in to save and view your compiler sessions."
    : "Configure Clerk or set AUTH_DISABLED=true on the backend for local saves.";
}
