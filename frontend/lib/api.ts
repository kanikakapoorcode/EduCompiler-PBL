import type { CompileResponse } from "./types";
import { normalizeCompileResponse } from "./normalize-response";
import {
  buildBigMockResponse,
  mockErrorResponse,
  mockSuccessResponse,
} from "./mock-data";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
    await new Promise((r) => setTimeout(r, 900));
    if (detectLikelyError(source)) return { ...mockErrorResponse };
    if (source.length > 200 || source.includes("mathScore")) {
      return buildBigMockResponse();
    }
    return { ...mockSuccessResponse };
  }

  try {
    const res = await fetch(`${API_BASE}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source,
        enable_semantic: true,
        enable_symbol_table: true,
      }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const raw = (await res.json()) as Record<string, unknown>;
    return normalizeCompileResponse(raw);
  } catch {
    await new Promise((r) => setTimeout(r, 500));
    return detectLikelyError(source)
      ? { ...mockErrorResponse }
      : { ...mockSuccessResponse };
  }
}
