import { AnimatePresence, motion } from "framer-motion";
import { Brain, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { aiApi } from "@/lib/mock-api";
import { useDashboard } from "@/lib/dashboard/store";

const suggestions = ["Forecast enrollment", "Attendance anomalies", "At-risk students", "Faculty utilisation"];

export function AIAssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const chat = useDashboard((s) => s.chat);
  const append = useDashboard((s) => s.appendMessage);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length, thinking, open]);

  async function send(prompt: string) {
    if (!prompt.trim() || thinking) return;
    append({ role: "user", content: prompt });
    setInput("");
    setThinking(true);
    try {
      const reply = await aiApi.ask(prompt);
      append({ role: "ai", content: reply });
    } finally {
      setThinking(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[440px] flex flex-col glass-strong border-l border-white/[0.08]"
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-aurora flex items-center justify-center shadow-glow">
                  <Brain className="h-4 w-4 text-background" strokeWidth={2.25} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Aether Intelligence</div>
                  <div className="text-[10px] text-cyan flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-glow" /> Online · GPT-class
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.06]" aria-label="Close">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
              {chat.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                      m.role === "ai" ? "bg-aurora" : "glass-strong"
                    }`}
                  >
                    {m.role === "ai" ? <Sparkles className="h-3.5 w-3.5 text-background" /> : <span className="text-[10px] font-bold text-foreground">HV</span>}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "ai" ? "glass text-foreground" : "bg-foreground text-background"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {thinking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-aurora flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-background" />
                  </div>
                  <div className="glass rounded-2xl px-3.5 py-3 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-foreground/70"
                        animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, delay: i * 0.12, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            <div className="px-5 pb-3 flex gap-1.5 flex-wrap">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full glass hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-4 border-t border-white/[0.06] flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aether anything…"
                className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60"
              />
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
