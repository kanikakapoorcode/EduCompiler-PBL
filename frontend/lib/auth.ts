/**
 * Local auth helpers — isolated from Clerk.
 */

export const HAS_CLERK = false;

export async function getSessionToken(): Promise<string | null> {
  return "dev";
}

export function authRequiredMessage(): string {
  return "Saves and history are active in local mode.";
}
