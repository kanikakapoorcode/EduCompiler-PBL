"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Brain,
  GitBranch,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const features = [
  {
    icon: Layers,
    title: "Phase Visualization",
    description:
      "Watch each compiler phase execute in real time with animated transitions and glowing pipeline stages.",
  },
  {
    icon: Zap,
    title: "Live Token Stream",
    description:
      "See tokens generated dynamically as lexical analysis scans your source code character by character.",
  },
  {
    icon: GitBranch,
    title: "Parse Tree Builder",
    description:
      "Interactive React Flow diagrams show how your program structure emerges from syntax analysis.",
  },
  {
    icon: AlertCircle,
    title: "Syntax Error Detection",
    description:
      "Pinpoint errors with line-level highlighting and intelligent correction suggestions.",
  },
  {
    icon: Brain,
    title: "Smart Suggestions",
    description:
      "AI-inspired hints help you understand and fix syntax mistakes while learning compiler theory.",
  },
  {
    icon: Sparkles,
    title: "Educational Focus",
    description:
      "Built for students and educators exploring lexical analysis, parsing, and compiler design.",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl text-center mb-16"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          Everything you need to <span className="gradient-text">learn compilers</span>
        </h2>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
          An interactive platform that demystifies how programming languages are
          translated from source code to executable logic.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard hover className="h-full">
              <f.icon className="h-10 w-10 text-indigo-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
