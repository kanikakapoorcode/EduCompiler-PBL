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

async function authFetch(
  path: string,
  token: string | null,
  options: RequestInit = {}
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    throw new Error("Unauthorized — please sign in again");
  }
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
      if (res.status === 401 && err.code === "unauthorized") {
        message +=
          " — Set AUTH_DISABLED=true in backend/.env and restart the server for local dev.";
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

export async function saveCompilation(
  token: string | null,
  payload: {
    source_code: string;
    tokens: unknown[];
    errors: unknown[];
    syntax_status: string;
  }
): Promise<SavedSession> {
  return authFetch("/sessions", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchDashboard(token: string | null): Promise<DashboardData> {
  return authFetch("/sessions/stats/dashboard", token);
}

export async function fetchSessions(token: string | null): Promise<{
  sessions: SavedSession[];
  count: number;
}> {
  return authFetch("/sessions", token);
}

export async function fetchSession(
  token: string | null,
  id: string
): Promise<SavedSession> {
  return authFetch(`/sessions/${id}`, token);
}

export async function deleteSession(
  token: string | null,
  id: string
): Promise<void> {
  await authFetch(`/sessions/${id}`, token, { method: "DELETE" });
}
