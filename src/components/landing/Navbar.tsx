import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const nav = [
  { label: "Platform", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(1200px,calc(100%-2rem))]"
    >
      <div className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between shadow-elev">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative h-8 w-8 rounded-lg bg-aurora shadow-glow flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-lg bg-aurora blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
          </div>
          <span className="font-semibold tracking-tight text-foreground">
            Aether<span className="text-gradient">Campus</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors">
            Sign in
          </a>
          <Link
            to="/dashboard"
            className="text-sm font-medium px-4 py-2 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Launch app
          </Link>
        </div>
      </div>
    </motion.header>
  );
}