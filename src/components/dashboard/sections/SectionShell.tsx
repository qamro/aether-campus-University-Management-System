import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { aiApi } from "@/lib/mock-api";

export function SectionShell({
  title,
  subtitle,
  actions,
  insightSection,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  insightSection: string;
  children: ReactNode;
}) {
  const insights = aiApi.insights(insightSection);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-wider text-cyan">Module</div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mt-1">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {insights.length > 0 && (
        <div className="rounded-2xl glass-strong p-4 flex items-start gap-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-aurora opacity-[0.06]" />
          <div className="relative h-8 w-8 rounded-lg bg-aurora flex items-center justify-center shrink-0 shadow-glow">
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan">Aether insight · {insightSection}</div>
            <ul className="mt-1 space-y-0.5">
              {insights.map((i) => (
                <li key={i} className="text-xs text-foreground/90">{i}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {children}
    </motion.div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl glass p-12 text-center text-sm text-muted-foreground">{label}</div>
  );
}

export function LoadingState() {
  return (
    <div className="rounded-2xl glass p-12 flex items-center justify-center">
      <div className="flex gap-1.5">
        {[0,1,2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse-glow"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}