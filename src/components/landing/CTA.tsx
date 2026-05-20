import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CTA() {
  return (
    <section className="py-32 relative">
      <div className="container max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center glass-strong"
        >
          <div className="absolute inset-0 bg-aurora opacity-20" />
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[600px] bg-aurora opacity-40 blur-[100px] rounded-full" />
          <div className="relative">
            <Sparkles className="h-7 w-7 mx-auto text-cyan mb-5" />
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1] text-foreground">
              The next century of education<br />
              <span className="text-gradient">starts with one decision.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Join the institutions building the future of learning on AetherCampus.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-foreground text-background font-medium text-sm shadow-glow"
              >
                Open the console
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass text-foreground text-sm font-medium hover:bg-white/[0.08] transition-colors">
                Book a demo
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}