"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Cpu className="h-8 w-8 text-indigo-400" />
          <span className="text-lg font-bold tracking-tight">
            Edu<span className="text-indigo-400">Compiler</span>
          </span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <a href="#features" className="text-sm text-slate-400 hover:text-white">
            Features
          </a>
          <a href="#pipeline" className="text-sm text-slate-400 hover:text-white">
            Pipeline
          </a>
          <Button href="/workspace" variant="ghost">
            Workspace
          </Button>
          <Button href="/dashboard" variant="primary">
            Dashboard
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-slate-400"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-white/10 px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <a href="#features" onClick={closeMenu}>
              Features
            </a>
            <Button href="/workspace" onClick={closeMenu}>
              Workspace
            </Button>
            <Button href="/dashboard" variant="ghost" onClick={closeMenu}>
              Dashboard
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
