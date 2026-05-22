import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "./Features";

const faqs = [
  { q: "How long does deployment take?", a: "Most institutions go live in 4–8 weeks. Multi-campus systems typically complete rollout in a single quarter with our success engineering team." },
  { q: "Where does Aether Intelligence run?", a: "Our models run on globally distributed inference infrastructure with regional pinning. You choose where data resides, including private/on-prem options." },
  { q: "Is AetherCampus FERPA compliant?", a: "Yes, FERPA, GDPR, SOC 2 Type II, and ISO 27001. Granular role-based access, full audit logs, and customer-managed encryption keys are standard." },
  { q: "Can we integrate existing systems?", a: "Aether ships with first-class integrations for Banner, PeopleSoft, Workday, Canvas, Moodle, and Microsoft / Google Workspace. Open APIs and webhooks for the rest." },
  { q: "What does support look like?", a: "Every customer gets a named success engineer. Enterprise tiers include 24/7 response with strict SLAs and embedded onboarding." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-32 relative">
      <div className="container max-w-3xl mx-auto px-6">
        <SectionHeader eyebrow="Questions" title={<>Everything you might ask, <span className="text-muted-foreground">answered.</span></>} />
        <div className="mt-14 space-y-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="rounded-2xl glass overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-base font-medium text-foreground tracking-tight">{f.q}</span>
                  <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }}>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}