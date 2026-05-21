import type { CompileResponse } from "./types";
import {
  mockErrorResponse,
  mockSuccessResponse,
} from "./mock-data";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Use mock when explicitly enabled (default: try live API, fallback to mock) */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

function detectLikelyError(source: string): boolean {
  const lines = source.split("\n");
  return lines.some((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//")) return false;
    if (trimmed.endsWith(";") || trimmed.endsWith("}")) return false;

    if (
      trimmed.startsWith("int ") ||
      trimmed.startsWith("float ") ||
      trimmed.startsWith("void ")
    ) {
      return true;
    }
    if (trimmed.startsWith("print(")) return true;
    if (trimmed.includes("=") && !trimmed.startsWith("if ")) return true;

    return false;
  });
}

export async function compileCode(
  source: string
): Promise<CompileResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return detectLikelyError(source)
      ? { ...mockErrorResponse }
      : { ...mockSuccessResponse };
  }

  try {
    const res = await fetch(`${API_BASE}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return (await res.json()) as CompileResponse;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
    return detectLikelyError(source)
      ? { ...mockErrorResponse }
      : { ...mockSuccessResponse };
  }
}
