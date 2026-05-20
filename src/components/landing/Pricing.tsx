import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SectionHeader } from "./Features";

const tiers = [
  {
    name: "Foundation",
    price: "$2,400",
    unit: "/ month",
    desc: "For colleges modernising core operations.",
    features: ["Up to 5,000 students", "Scheduling + analytics", "AI assistant (10k msgs)", "Email support"],
  },
  {
    name: "Scale",
    price: "$7,800",
    unit: "/ month",
    desc: "For multi-faculty universities and growing networks.",
    features: ["Up to 50,000 students", "All AI modules", "Predictive analytics", "SSO + audit logs", "Priority support"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "",
    desc: "For systems, governments, and multi-campus institutions.",
    features: ["Unlimited scale", "Dedicated infrastructure", "On-prem deployment option", "24/7 success engineering", "Custom AI training"],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="container max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow="Pricing" title={<>Built for institutions of <span className="text-gradient">every scale.</span></>} />
        <div className="mt-16 grid md:grid-cols-3 gap-4">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 ${t.featured ? "glass-strong shadow-glow" : "glass"}`}
            >
              {t.featured && (
                <>
                  <div className="absolute -inset-px rounded-2xl bg-aurora opacity-50 blur-md -z-10" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-[10px] font-semibold uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </div>
                </>
              )}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-foreground">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.unit}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <button
                className={`mt-6 w-full py-3 rounded-xl text-sm font-medium transition-all ${
                  t.featured ? "bg-foreground text-background hover:opacity-90" : "glass-strong text-foreground hover:bg-white/[0.08]"
                }`}
              >
                {t.name === "Enterprise" ? "Talk to sales" : "Start free trial"}
              </button>
              <ul className="mt-7 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <div className="h-4 w-4 rounded-full bg-white/[0.06] flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="h-2.5 w-2.5 text-cyan" strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}