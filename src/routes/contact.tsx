import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight, CheckCircle2, ChevronDown, Clock,
  Loader2, Mail, MapPin, Phone, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { contactSchema, type ContactInput } from "@/lib/auth/schemas";
import { contactApi } from "@/lib/mock-api";
import { inputCls, FloatingField } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AetherCampus" },
      { name: "description", content: "Speak with the AetherCampus team about deploying intelligent infrastructure at your institution." },
      { property: "og:title", content: "Contact — AetherCampus" },
      { property: "og:description", content: "Talk to our team about AI for higher education." },
    ],
  }),
  component: ContactPage,
});

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@aethercampus.ai", href: "mailto:hello@aethercampus.ai" },
  { icon: Phone, label: "Phone", value: "+213 555 50 61 42", href: "tel:+213 555 50 61 42" },
  { icon: MapPin, label: "HQ", value: "Sétif · Béjaia · Algiers, Algeria" },
  { icon: Clock, label: "Office hours", value: "Sun–Thu, 09:00 – 18:00 (PT / CET / SGT)" },
];

const faqs = [
  { q: "How long does deployment take?", a: "Most institutions are live in 2–6 weeks. White-glove migration is included on Scale and Enterprise plans." },
  { q: "Is AetherCampus FERPA and GDPR compliant?", a: "Yes. SOC 2 Type II, FERPA, and GDPR. Data residency in US, EU, and APAC." },
  { q: "Can we keep our existing SIS?", a: "Absolutely. We integrate with Banner, PeopleSoft, Workday Student, Anthology, and 40+ more via native connectors." },
  { q: "What does Aether Intelligence actually do?", a: "It forecasts enrollment, predicts retention risk, automates scheduling, and powers a conversational copilot for everyone on campus." },
];

const socials: { label: string; href: string; path: string }[] = [
  {
    label: "GitHub",
    href: "#",
    path: "M12 .5C5.73.5.5 5.74.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z",
  },
  {
    label: "Twitter / X",
    href: "#",
    path: "M18.244 2H21.5l-7.5 8.57L23 22h-6.75l-5.28-6.42L4.92 22H1.66l8.02-9.16L1 2h6.91l4.77 5.86L18.24 2Zm-1.18 18h1.87L7.04 4H5.05l12.01 16Z",
  },
];

function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <ContactHero />
      <ContactGrid />
      <ContactFAQ />
      <Footer />
    </main>
  );
}

function ContactHero() {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] bg-aurora opacity-20 blur-[140px] rounded-full animate-aurora" />
      <div className="container max-w-5xl mx-auto px-6 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3 w-3 text-cyan" /> We reply within 4 business hours
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-5xl md:text-7xl font-semibold tracking-[-0.04em] text-foreground"
        >
          Let's design the <span className="text-gradient">future of your campus.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Whether you're modernising a faculty or rolling out across a multi-campus system, our specialists will tailor an AetherCampus deployment to your institution.
        </motion.p>
      </div>
    </section>
  );
}

function ContactGrid() {
  return (
    <section className="relative py-12">
      <div className="container max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-6">
        <ContactForm />
        <aside className="lg:col-span-2 space-y-4">
          <div className="glass-strong rounded-3xl p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan">Reach us</div>
            <div className="mt-4 space-y-4">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg glass flex items-center justify-center shrink-0">
                    <c.icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} className="text-sm text-foreground hover:text-cyan transition-colors break-words">{c.value}</a>
                    ) : (
                      <div className="text-sm text-foreground break-words">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <FuturisticMap />

          <div className="glass-strong rounded-3xl p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan">Follow Aether</div>
            <div className="mt-4 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-white/[0.08] hover:shadow-glow transition-all"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-foreground/90 group-hover:fill-cyan transition-colors">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ContactForm() {
  const [success, setSuccess] = useState<{ ticketId: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactInput) {
    try {
      const res = await contactApi.send(values);
      setSuccess(res);
      reset();
      toast.success(`Message sent · ticket ${res.ticketId}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-3 glass-strong rounded-3xl p-8 relative overflow-hidden"
    >
      <div className="absolute -top-32 -right-32 h-72 w-72 bg-aurora opacity-15 blur-3xl rounded-full pointer-events-none" />
      {success ? (
        <div className="relative text-center py-14">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mx-auto h-16 w-16 rounded-2xl bg-aurora flex items-center justify-center shadow-glow"
          >
            <CheckCircle2 className="h-8 w-8 text-background" strokeWidth={2.5} />
          </motion.div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">Message received.</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Your ticket <span className="text-foreground font-mono">{success.ticketId}</span> is in our queue. A specialist will reach out within 4 business hours.
          </p>
          <button
            onClick={() => setSuccess(null)}
            className="mt-6 inline-flex items-center gap-2 text-sm text-foreground hover:text-cyan transition-colors"
          >
            Send another <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5" noValidate>
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan">Send a message</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatingField label="Full name" error={errors.name?.message}>
              <input className={inputCls} placeholder="Helena Voss" {...register("name")} />
            </FloatingField>
            <FloatingField label="Email" error={errors.email?.message}>
              <input type="email" className={inputCls} placeholder="you@university.edu" {...register("email")} />
            </FloatingField>
          </div>
          <FloatingField label="Subject" error={errors.subject?.message}>
            <input className={inputCls} placeholder="Deploying AetherCampus across our system" {...register("subject")} />
          </FloatingField>
          <FloatingField label="Message" error={errors.message?.message}>
            <textarea
              rows={6}
              className={`${inputCls} resize-none`}
              placeholder="Tell us about your institution, current systems, and what you'd like to transform."
              {...register("message")}
            />
          </FloatingField>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                Send message <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}

function FuturisticMap() {
  return (
    <div className="relative glass-strong rounded-3xl p-6 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-10 pointer-events-none" />
      <div className="text-xs font-semibold uppercase tracking-wider text-cyan relative">Global presence</div>
      <div className="relative mt-4 h-44 rounded-2xl bg-background/40 border border-white/[0.06] overflow-hidden">
        <svg viewBox="0 0 400 180" className="w-full h-full">
          <defs>
            <radialGradient id="mg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.7 0.18 240)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="oklch(0.7 0.18 240)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1="0" x2="400" y1={i * 15} y2={i * 15} stroke="oklch(0.97 0.005 260 / 0.05)" />
          ))}
          {Array.from({ length: 26 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 16} x2={i * 16} y1="0" y2="180" stroke="oklch(0.97 0.005 260 / 0.05)" />
          ))}
          {[
            { x: 80, y: 80, label: "Algiers" },
            { x: 200, y: 65, label: "Béjaia" },
            { x: 310, y: 110, label: "Sétif" },
          ].map((p) => (
            <g key={p.label}>
              <circle cx={p.x} cy={p.y} r="22" fill="url(#mg)" />
              <circle cx={p.x} cy={p.y} r="4" fill="oklch(0.82 0.14 210)">
                <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <text x={p.x + 9} y={p.y + 3} fontSize="9" fill="oklch(0.97 0.005 260 / 0.7)">{p.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-24">
      <div className="container max-w-3xl mx-auto px-6">
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan">Support</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Quick answers, before you write.
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-foreground">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
