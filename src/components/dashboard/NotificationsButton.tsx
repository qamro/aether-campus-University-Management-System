import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDashboard } from "@/lib/dashboard/store";

const categoryColor: Record<string, string> = {
  system: "bg-muted-foreground",
  ai: "bg-violet",
  academic: "bg-primary",
  alert: "bg-destructive",
};

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useDashboard((s) => s.notifications);
  const markRead = useDashboard((s) => s.markRead);
  const markAllRead = useDashboard((s) => s.markAllRead);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative glass rounded-lg p-2 hover:bg-white/[0.06] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4 text-foreground" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-cyan text-background text-[9px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl shadow-elev z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="text-sm font-semibold text-foreground">Notifications</div>
              <button
                onClick={markAllRead}
                className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            </div>
            <div className="max-h-96 overflow-auto">
              {notifications.length === 0 && (
                <div className="px-4 py-10 text-center text-xs text-muted-foreground">You're all caught up.</div>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors ${!n.read ? "bg-white/[0.02]" : ""}`}
                >
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${categoryColor[n.category]} ${!n.read ? "animate-pulse-glow" : "opacity-40"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-foreground truncate">{n.title}</div>
                      <div className="text-[10px] text-muted-foreground shrink-0">{timeAgo(n.createdAt)}</div>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{n.body}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
