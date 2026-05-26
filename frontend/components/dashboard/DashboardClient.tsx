"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cpu,
  Play,
  Trash2,
  AlertTriangle,
  CheckCircle,
  History,
  Code2,
  Bookmark,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  fetchDashboard,
  deleteSession,
  type DashboardData,
  type SavedSession,
} from "@/lib/sessions-api";

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await fetchDashboard();
      setData(d);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 bg-[#030712]">
        Loading dashboard…
      </div>
    );
  }

  const stats = [
    {
      label: "Total compilations",
      value: data?.total_compilations ?? 0,
      icon: History,
      color: "text-indigo-400",
    },
    {
      label: "Saved programs",
      value: data?.saved_programs ?? data?.total_compilations ?? 0,
      icon: Bookmark,
      color: "text-violet-400",
    },
    {
      label: "Successful",
      value: data?.success_runs ?? 0,
      icon: CheckCircle,
      color: "text-emerald-400",
    },
    {
      label: "With errors",
      value: data?.error_runs ?? 0,
      icon: AlertTriangle,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="glass-strong border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="h-7 w-7 text-indigo-400" />
          <div>
            <h1 className="font-semibold text-white">My Dashboard</h1>
            <p className="text-xs text-slate-500">
              Compiler history & stats
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button href="/workspace" variant="primary" className="!py-2 !px-4">
            <Play className="h-4 w-4" />
            Open workspace
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {error && (
          <GlassCard className="border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm">
            {error}
            <p className="text-xs mt-2 text-slate-500">
              Ensure the backend is running on port 8000.
            </p>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="!p-5">
                <s.icon className={`h-6 w-6 mb-3 ${s.color}`} />
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-400" />
            Recent compilations
          </h2>

          {!data?.recent_sessions?.length ? (
            <p className="text-sm text-slate-500 py-8 text-center">
              No saved sessions yet. Compile in the workspace and click Save.
            </p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto">
              {data.recent_sessions.map((session: SavedSession, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-lg border border-white/10 bg-slate-900/50 p-4 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded ${
                            session.syntax_status === "success"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {session.syntax_status}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {session.created_at
                            ? new Date(session.created_at).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      <pre className="text-xs font-mono text-slate-400 line-clamp-3 whitespace-pre-wrap">
                        {session.source_code}
                      </pre>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link
                        href={`/workspace?session=${session.id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Reopen
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(session.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
