import { motion } from "framer-motion";
import { SectionHeader } from "./Features";

const items = [
  { quote: "AetherCampus replaced eleven legacy tools in a single quarter. Our staff finally trusts the data.", name: "Dr. Helena Voss", role: "Provost, Northbridge University" },
  { quote: "The scheduling engine alone saved us four months of registrar work. The AI insights are uncanny.", name: "Marcus Chen", role: "VP Operations, Pacific Tech Institute" },
  { quote: "It feels less like software and more like an institution that's finally listening.", name: "Aisha Okafor", role: "Dean of Students, Atlas College" },
  { quote: "We onboarded 22 campuses in 8 weeks. The product is genuinely a category leap.", name: "Dr. Ren Takahashi", role: "CIO, Meridian University System" },
];

export function Testimonials() {
  return (
    <section className="py-32 relative">
      <div className="container max-w-6xl mx-auto px-6">
        <SectionHeader eyebrow="Voices" title={<>Trusted by leaders<br /><span className="text-muted-foreground">of forward-thinking institutions.</span></>} />
        <div className="mt-16 grid md:grid-cols-2 gap-4">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl glass p-7 relative overflow-hidden group"
            >
              <div className="absolute -top-12 -right-12 h-40 w-40 bg-aurora opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity" />
              <blockquote className="text-lg leading-relaxed text-foreground/90 tracking-tight">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-aurora shadow-glow flex items-center justify-center text-sm font-semibold text-background">
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}