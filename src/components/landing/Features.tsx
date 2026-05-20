import { motion } from "framer-motion";
import {
  Brain,
  Calendar,
  ChartBar,
  MessageSquare,
  ShieldCheck,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

const features = [
  { icon: Brain, title: "Predictive intelligence", desc: "Forecast enrollment, retention, and risk months ahead with ensemble models." },
  { icon: Calendar, title: "Autonomous scheduling", desc: "Conflict-free timetables generated in seconds across thousands of constraints." },
  { icon: ChartBar, title: "Real-time analytics", desc: "Live dashboards across every campus, faculty, and learning outcome." },
  { icon: MessageSquare, title: "AI assistant", desc: "Conversational copilot for students, faculty, and administrators." },
  { icon: Workflow, title: "Unified workflows", desc: "Admissions, grading, attendance, and finance — one composable surface." },
  { icon: Users, title: "Student success", desc: "Detect at-risk students early and intervene with personalised guidance." },
  { icon: ShieldCheck, title: "Enterprise security", desc: "SOC 2, FERPA, GDPR. SSO, audit logs, and granular role policies." },
  { icon: Zap, title: "Built for scale", desc: "Edge-rendered. Globally distributed. Designed for millions of records." },
];

export function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="Platform"
          title={<>Everything a modern campus needs.<br /><span className="text-muted-foreground">Nothing it doesn't.</span></>}
        />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative rounded-2xl glass p-6 hover:bg-white/[0.06] transition-all overflow-hidden"
            >
              <div className="absolute -top-px left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                <f.icon className="h-5 w-5 text-foreground" strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-semibold text-foreground tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, center = true }: { eyebrow: string; title: React.ReactNode; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
      <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
        {eyebrow}
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
      </div>
      <h2 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-foreground">
        {title}
      </h2>
    </div>
  );
}