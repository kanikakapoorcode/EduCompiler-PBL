import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-4",
        hover && "transition-colors hover:border-indigo-500/30",
        glow && "glow-accent",
        className
      )}
    >
      {children}
    </div>
  );
}
