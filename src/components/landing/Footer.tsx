import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

const cols = [
  { title: "Product", links: ["Platform", "AI", "Dashboard", "Integrations", "Changelog"] },
  { title: "Solutions", links: ["Universities", "Colleges", "Systems", "Government", "Research"] },
  { title: "Resources", links: ["Documentation", "Guides", "Case studies", "API", "Status"] },
  { title: "Company", links: ["About", "Careers", "Press", "Security"] },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] mt-12">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-aurora flex items-center justify-center shadow-glow">
                <Sparkles className="h-4 w-4 text-background" />
              </div>
              <span className="font-semibold tracking-tight text-foreground">
                Aether<span className="text-gradient">Campus</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              The AI operating system for the modern university. Built with care in Zurich, Singapore, and San Francisco.
            </p>
            <form className="mt-6 flex glass rounded-xl p-1 max-w-sm">
              <input
                type="email"
                placeholder="you@university.edu"
                className="flex-1 bg-transparent text-sm px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="px-4 py-2 rounded-lg bg-foreground text-background text-xs font-semibold">
                Subscribe
              </button>
            </form>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-4">{c.title}</div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row gap-4 justify-between text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>© {new Date().getFullYear()} AetherCampus, Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-cyan animate-pulse-glow" />
              <span className="text-muted-foreground/80">
                Developed by{" "}
                <span className="text-gradient font-medium tracking-tight">Mohamed Qamar Eddine Bakhouche</span>
              </span>
            </span>
          </div>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">SOC 2</a>
            <a href="#" className="hover:text-foreground transition-colors">FERPA</a>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="relative mt-20 select-none pointer-events-none overflow-hidden">
          <div className="text-[clamp(4rem,18vw,16rem)] font-bold tracking-[-0.05em] leading-none text-center bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text text-transparent">
            AetherCampus
          </div>
        </div>
      </div>
    </footer>
  );
}