"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Cpu className="h-6 w-6 text-indigo-400" />
          <span className="font-semibold">
            Edu<span className="text-indigo-400">Compiler</span>
          </span>
        </div>
        <p className="text-sm text-slate-500 text-center">
          Intelligent Syntax Error Detection & Compiler Phase Visualization
        </p>
        <Link
          href="/workspace"
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          Open Workspace →
        </Link>
      </div>
    </footer>
  );
}
