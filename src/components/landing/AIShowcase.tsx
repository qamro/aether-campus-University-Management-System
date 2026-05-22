import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, Calendar, BookOpen, MessageSquare } from "lucide-react";
import { SectionHeader } from "./Features";

const capabilities = [
  { icon: Calendar, title: "AI Scheduling", metric: "12,400 slots/sec" },
  { icon: TrendingUp, title: "Predictive Analytics", metric: "94% accuracy" },
  { icon: BookOpen, title: "Adaptive Classrooms", metric: "1:1 personalized" },
  { icon: MessageSquare, title: "AI Assistant", metric: "42ms latency" },
];

export function AIShowcase() {
  return (
    <section id="ai" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] bg-aurora opacity-15 blur-[120px] rounded-full" />
      </div>
      <div className="container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Aether Intelligence"
          title={<>An AI that <span className="text-gradient">understands your campus.</span></>}
        />

        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual: neural core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square rounded-3xl glass-strong overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 grid-bg opacity-50" />
            {/* concentric rings */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-white/10"
                style={{ width: `${30 + i * 20}%`, height: `${30 + i * 20}%` }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20 + i * 6, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-cyan shadow-glow" />
              </motion.div>
            ))}
            {/* core */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-28 w-28 rounded-full bg-aurora shadow-glow flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-aurora blur-2xl opacity-60 rounded-full" />
              <Brain className="relative h-12 w-12 text-background" strokeWidth={1.5} />
            </motion.div>

            {/* floating chips */}
            {capabilities.map((c, i) => {
              const positions = [
                { top: "8%", left: "10%" },
                { top: "12%", right: "8%" },
                { bottom: "14%", left: "6%" },
                { bottom: "10%", right: "10%" },
              ];
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="absolute glass rounded-xl px-3 py-2 flex items-center gap-2"
                  style={positions[i]}
                >
                  <c.icon className="h-3.5 w-3.5 text-cyan" />
                  <span className="text-xs font-medium text-foreground">{c.title}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* capability list */}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground leading-relaxed">
              Aether Intelligence runs continuously across your institution, ingesting attendance, performance, schedules, and behaviour to deliver decisions before you ask.
            </div>
            {capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex items-center gap-4 p-5 rounded-2xl glass hover:bg-white/[0.06] transition-all"
              >
                <div className="h-11 w-11 rounded-xl bg-aurora/20 flex items-center justify-center">
                  <c.icon className="h-5 w-5 text-cyan" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.metric}</div>
                </div>
                <Sparkles className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}