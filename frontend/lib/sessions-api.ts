const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface SavedSession {
  id: string;
  user_id: string;
  source_code: string;
  tokens: unknown[];
  errors: unknown[];
  syntax_status: string;
  created_at: string | null;
}

export interface DashboardData {
  total_compilations: number;
  saved_programs: number;
  error_runs: number;
  success_runs: number;
  recent_sessions: SavedSession[];
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const err = await res.json();
      if (err.detail) {
        message =
          typeof err.detail === "string"
            ? err.detail
            : JSON.stringify(err.detail);
      }
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function saveCompilation(payload: {
  source_code: string;
  tokens: unknown[];
  errors: unknown[];
  syntax_status: string;
}): Promise<SavedSession> {
  return apiFetch("/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchDashboard(): Promise<DashboardData> {
  return apiFetch("/sessions/stats/dashboard");
}

export async function fetchSessions(): Promise<{
  sessions: SavedSession[];
  count: number;
}> {
  return apiFetch("/sessions");
}

export async function fetchSession(id: string): Promise<SavedSession> {
  return apiFetch(`/sessions/${id}`);
}

export async function deleteSession(id: string): Promise<void> {
  await apiFetch(`/sessions/${id}`, { method: "DELETE" });
}
