"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, FileCode } from "lucide-react";
import { CODE_SAMPLES, type CodeSample } from "@/lib/code-samples";
import { cn } from "@/lib/utils";

interface SampleProgramPickerProps {
  onSelect: (code: string) => void;
  disabled?: boolean;
}

export function SampleProgramPicker({
  onSelect,
  disabled,
}: SampleProgramPickerProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<CodeSample>(CODE_SAMPLES[0]);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 288 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const pick = (sample: CodeSample) => {
    setActive(sample);
    onSelect(sample.code);
    setOpen(false);
  };

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const update = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        left: rect.left,
        width: Math.max(rect.width, 288),
      });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const menu =
    open && typeof document !== "undefined"
      ? createPortal(
          <>
            <div
              className="fixed inset-0 z-[200]"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div
              className="fixed z-[210] rounded-lg border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-md py-1 max-h-80 overflow-y-auto"
              style={{
                top: menuPos.top,
                left: menuPos.left,
                width: menuPos.width,
              }}
              role="listbox"
            >
              {CODE_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => pick(sample)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 hover:bg-indigo-500/15 transition-colors",
                    active.id === sample.id && "bg-indigo-500/20"
                  )}
                >
                  <p className="text-xs font-medium text-white">{sample.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {sample.description}
                  </p>
                </button>
              ))}
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-200 hover:bg-indigo-500/20 transition-colors",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <FileCode className="h-3.5 w-3.5" />
        {active.name}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      {menu}
    </div>
  );
}
