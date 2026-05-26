import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduCompiler — Intelligent Compiler Visualization",
  description:
    "Interactive educational platform for lexical analysis, syntax parsing, token visualization, and intelligent syntax error detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
