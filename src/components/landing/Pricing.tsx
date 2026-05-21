import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionHeader } from "./Features";
import { usePricing } from "@/lib/pricing/store";
import { pricingApi, type Plan } from "@/lib/mock-api";

const tiers: {
  id: Plan["id"];
  name: string;
  monthly: number | null;
  yearly: number | null;
  desc: string;
  features: string[];
  featured?: boolean;
}[] = [
  {
    id: "foundation",
    name: "Foundation",
    monthly: 2400,
    yearly: 24000,
    desc: "For colleges modernising core operations.",
    features: ["Up to 5,000 students", "Scheduling + analytics", "AI assistant (10k msgs)", "Email support"],
  },
  {
    id: "scale",
    name: "Scale",
    monthly: 7800,
    yearly: 78000,
    desc: "For multi-faculty universities and growing networks.",
    features: ["Up to 50,000 students", "All AI modules", "Predictive analytics", "SSO + audit logs", "Priority support"],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    yearly: null,
    desc: "For systems, governments, and multi-campus institutions.",
    features: ["Unlimited scale", "Dedicated infrastructure", "On-prem deployment option", "24/7 success engineering", "Custom AI training"],
  },
];

function formatPrice(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

export function Pricing() {
  const { cycle, setCycle, selectedPlan, selectPlan, setSubscription, activeSubscription } = usePricing();
  const [processingId, setProcessingId] = useState<Plan["id"] | null>(null);
  const [success, setSuccess] = useState<Plan["id"] | null>(null);

  async function handleSubscribe(id: Plan["id"]) {
    selectPlan(id);
    if (id === "enterprise") {
      toast.message("Our sales team will reach out within 4 hours.", { description: "Enterprise inquiry captured." });
      return;
    }
    setProcessingId(id);
    try {
      const res = await pricingApi.subscribe(id);
      setSubscription(res);
      setSuccess(id);
      toast.success(`Subscribed to ${id} · ${res.subscriptionId.slice(0, 14)}…`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section id="pricing" className="py-32 relative">
      <div className="container max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow="Pricing" title={<>Built for institutions of <span className="text-gradient">every scale.</span></>} />

        <div className="mt-10 flex justify-center">
          <div className="inline-flex glass rounded-full p-1 text-xs">
            {(["monthly", "yearly"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`relative px-4 py-2 rounded-full font-medium transition-colors ${
                  cycle === c ? "text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cycle === c && (
                  <motion.div
                    layoutId="cycle-pill"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative capitalize">{c}</span>
                {c === "yearly" && (
                  <span className={`relative ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${cycle === "yearly" ? "bg-background/20" : "bg-cyan/10 text-cyan"}`}>
                    −17%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {tiers.map((t, i) => {
            const price = cycle === "monthly" ? t.monthly : t.yearly;
            const isSelected = selectedPlan === t.id;
            const isProcessing = processingId === t.id;
            const isActive = activeSubscription?.planId === t.id;
            return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => selectPlan(t.id)}
              className={`relative rounded-2xl p-7 cursor-pointer transition-all ${
                t.featured ? "glass-strong shadow-glow" : "glass hover:bg-white/[0.05]"
              } ${isSelected ? "ring-1 ring-primary/60" : ""}`}
            >
              {t.featured && (
                <>
                  <div className="absolute -inset-px rounded-2xl bg-aurora opacity-50 blur-md -z-10" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-[10px] font-semibold uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
                {isActive && (
                  <span className="text-[10px] font-semibold text-cyan flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan/10">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Active
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${t.id}-${cycle}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-4xl font-semibold tracking-tight text-foreground"
                  >
                    {price === null ? "Custom" : formatPrice(price)}
                  </motion.span>
                </AnimatePresence>
                {price !== null && (
                  <span className="text-sm text-muted-foreground">/ {cycle === "monthly" ? "month" : "year"}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(t.id);
                }}
                disabled={isProcessing || isActive}
                className={`mt-6 w-full py-3 rounded-xl text-sm font-medium transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 ${
                  t.featured ? "bg-foreground text-background hover:opacity-90" : "glass-strong text-foreground hover:bg-white/[0.08]"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                  </>
                ) : isActive ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Subscribed
                  </>
                ) : t.id === "enterprise" ? (
                  "Talk to sales"
                ) : (
                  "Start free trial"
                )}
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
          );
          })}
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
            onClick={() => setSuccess(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md glass-strong rounded-3xl p-8 text-center shadow-elev"
            >
              <div className="absolute -inset-px rounded-3xl bg-aurora opacity-30 blur-md -z-10" />
              <div className="mx-auto h-14 w-14 rounded-2xl bg-aurora flex items-center justify-center shadow-glow">
                <CheckCircle2 className="h-7 w-7 text-background" strokeWidth={2.5} />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                You're on <span className="capitalize text-gradient">{success}</span>.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your AetherCampus workspace is being provisioned. Look out for an onboarding email shortly.
              </p>
              <button
                onClick={() => setSuccess(null)}
                className="mt-6 w-full py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}