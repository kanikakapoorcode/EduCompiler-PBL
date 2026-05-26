"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, ArrowLeft } from "lucide-react";

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthPageShell({ title, subtitle, children }: AuthPageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-transparent to-violet-950/20 pointer-events-none" />
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-indigo-600/10 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.55, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <header className="relative z-10 px-4 py-6 flex items-center justify-between max-w-lg mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <Cpu className="h-6 w-6 text-indigo-400" />
          <span className="font-semibold text-sm">
            Edu<span className="text-indigo-400">Compiler</span>
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8 max-w-md"
        >
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
