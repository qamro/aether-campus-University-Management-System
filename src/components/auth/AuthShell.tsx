import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-aurora opacity-20 blur-[120px] rounded-full pointer-events-none animate-aurora" />

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2.5 group z-10">
        <div className="relative h-8 w-8 rounded-lg bg-aurora shadow-glow flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
        </div>
        <span className="font-semibold tracking-tight text-foreground">
          Aether<span className="text-gradient">Campus</span>
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8 shadow-elev"
      >
        <div className="absolute -inset-px rounded-3xl bg-aurora opacity-20 blur-md -z-10" />
        <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan">{eyebrow}</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </motion.div>
    </main>
  );
}

export function FloatingField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {error && <span className="text-[11px] text-destructive">{error}</span>}
      </div>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_oklch(0.7_0.18_240/0.15)]";
