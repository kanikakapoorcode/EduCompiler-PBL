"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";
import { Loader2 } from "lucide-react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-slate-900/80">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    ),
  }
);

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors?: { line: number; message: string }[];
}

export function CodeEditor({ value, onChange, errors = [] }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const decorationIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    decorationIdsRef.current = editor.deltaDecorations(
      decorationIdsRef.current,
      errors.map((err) => ({
        range: new monaco.Range(err.line, 1, err.line, 1),
        options: {
          isWholeLine: true,
          className: "bg-red-500/20",
          linesDecorationsClassName: "border-l-2 border-red-500",
          glyphMarginClassName: "codicon-error",
          hoverMessage: { value: err.message },
        },
      }))
    );
  }, [errors]);

  return (
    <div className="monaco-wrapper h-full min-h-[280px] flex-1">
      <MonacoEditor
        height="100%"
        language="educompiler"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12 },
          glyphMargin: true,
        }}
        beforeMount={(monaco) => {
          monacoRef.current = monaco;
          monaco.languages.register({ id: "educompiler" });
          monaco.languages.setMonarchTokensProvider("educompiler", {
            keywords: [
              "int",
              "float",
              "if",
              "else",
              "while",
              "for",
              "return",
              "print",
              "void",
              "true",
              "false",
            ],
            operators: ["=", "+", "-", "*", "/", "==", "!=", "<", ">", "<=", ">="],
            tokenizer: {
              root: [
                [
                  /\b(int|float|if|else|while|for|return|print|void|true|false)\b/,
                  "keyword",
                ],
                [/\d+(\.\d+)?/, "number"],
                [/"[^"]*"/, "string"],
                [/[a-zA-Z_]\w*/, "identifier"],
                [/[+\-*/=<>!]+/, "operator"],
                [/[();,{}]/, "delimiter"],
                [/\/\/.*/, "comment"],
              ],
            },
          });
          monaco.editor.defineTheme("educompiler-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
              { token: "keyword", foreground: "c792ea" },
              { token: "number", foreground: "f78c6c" },
              { token: "string", foreground: "c3e88d" },
              { token: "identifier", foreground: "82aaff" },
              { token: "operator", foreground: "89ddff" },
              { token: "comment", foreground: "546e7a", fontStyle: "italic" },
            ],
            colors: {
              "editor.background": "#0f172a",
            },
          });
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          monacoRef.current = monaco;
          monaco.editor.setTheme("educompiler-dark");
        }}
      />
    </div>
  );
}
