import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

const stats = [
  { value: "240+", label: "Universities" },
  { value: "3.2M", label: "Students" },
  { value: "99.99%", label: "Uptime" },
  { value: "42ms", label: "AI latency" },
];

export function Hero() {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      {/* aurora glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[800px] w-[1200px] bg-aurora opacity-20 blur-[120px] rounded-full animate-aurora" />
        <div className="absolute inset-0 noise opacity-50" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-cyan animate-ping opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-cyan" />
          </span>
          Introducing Aether OS 2.0 - now in private beta
          <ArrowRight className="h-3 w-3" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[clamp(2.75rem,7vw,5.5rem)] font-semibold tracking-[-0.04em] leading-[0.95] text-foreground"
        >
          The AI operating system
          <br />
          for the <span className="text-gradient">modern university</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-7 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
        >
          One intelligent platform to schedule, predict, teach, and grow. Built
          for institutions that refuse to settle for legacy software.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/dashboard"
            className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-foreground text-background font-medium text-sm shadow-glow hover:shadow-[0_0_80px_-5px_oklch(0.7_0.18_240/0.7)] transition-all"
          >
            <Sparkles className="h-4 w-4" />
            Explore the dashboard
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass text-foreground text-sm font-medium hover:bg-white/[0.06] transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Watch the film
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl glass overflow-hidden max-w-3xl mx-auto"
        >
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-6 bg-background/30">
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-gradient">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}