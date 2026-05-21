"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CompilerFlowViz } from "./CompilerFlowViz";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Intelligent Syntax Error Detection & Compiler Visualization
          </motion.span>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="gradient-text">EduCompiler</span>
            <br />
            <span className="text-white">See how compilers think</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Write code in a mini language, then visually explore lexical analysis,
            token generation, parse trees, and intelligent error detection — all in
            one interactive workspace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/workspace" variant="primary">
              Start Compiling
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#pipeline" variant="secondary">
              <Play className="h-4 w-4" />
              View Pipeline
            </Button>
          </div>
        </motion.div>

        <motion.div
          id="pipeline"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16"
        >
          <CompilerFlowViz />
        </motion.div>
      </div>
    </section>
  );
}
