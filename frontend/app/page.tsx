import Link from "next/link";

const phases = [
  "Source Code",
  "Lexical Analysis",
  "Token Generation",
  "Syntax Analysis",
  "Parse Tree",
  "Error Detection",
  "Final Output",
];

const features = [
  {
    title: "Phase Visualization",
    description:
      "Watch each compiler phase execute with clear stage-by-stage feedback.",
  },
  {
    title: "Live Token Stream",
    description:
      "See tokens generated as lexical analysis scans your source code.",
  },
  {
    title: "Parse Tree Builder",
    description:
      "Step through syntax analysis and watch program structure emerge.",
  },
  {
    title: "Syntax Error Detection",
    description:
      "Pinpoint errors with line-level highlighting and suggestions.",
  },
  {
    title: "Smart Suggestions",
    description: "Hints help you fix syntax mistakes while learning.",
  },
  {
    title: "Educational Focus",
    description: "Built for students exploring compiler design.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-100">
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Edu<span className="text-indigo-400">Compiler</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <a href="#features" className="text-slate-400 hover:text-white">
              Features
            </a>
            <a href="#pipeline" className="text-slate-400 hover:text-white">
              Pipeline
            </a>
            <Link
              href="/workspace"
              className="rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5"
            >
              Workspace
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-grid">
        <div className="mx-auto max-w-7xl w-full text-center">
          <p className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-6">
            Intelligent Syntax Error Detection & Compiler Visualization
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="gradient-text">EduCompiler</span>
            <br />
            <span className="text-white">See how compilers think</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Write code in a mini language, then explore lexical analysis, tokens,
            parse trees, and error detection in one workspace.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workspace"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Start Compiling →
            </Link>
            <a
              href="#pipeline"
              className="rounded-lg glass border border-indigo-500/30 px-6 py-3 text-sm font-medium text-indigo-200 hover:border-indigo-400/50"
            >
              View Pipeline
            </a>
          </div>
        </div>

        <div id="pipeline" className="mx-auto mt-16 max-w-7xl w-full">
          <div className="rounded-2xl glass-strong p-6 sm:p-8">
            <ol className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {phases.map((label, i) => (
                <li
                  key={label}
                  className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-400"
                >
                  <span className="text-indigo-400 mr-1">{i + 1}.</span>
                  {label}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center mb-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything you need to{" "}
            <span className="gradient-text">learn compilers</span>
          </h2>
        </div>
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-xl p-5 h-full">
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 px-4 text-center text-sm text-slate-500">
        <p>EduCompiler — Compiler phase visualization for learning</p>
        <Link href="/workspace" className="mt-2 inline-block text-indigo-400 hover:text-indigo-300">
          Open Workspace →
        </Link>
      </footer>
    </main>
  );
}
