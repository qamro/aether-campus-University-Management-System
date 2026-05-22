import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, ArrowUpRight, BookOpen, Brain, Calendar, ChartBar,
  Command, GraduationCap, Home, MessageSquare, Search, Settings,
  Sparkles, Users, Zap, LogOut,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/store";
import { useDashboard } from "@/lib/dashboard/store";
import { NotificationsButton } from "@/components/dashboard/NotificationsButton";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { AIAssistantPanel } from "@/components/dashboard/AIAssistantPanel";
import { CoursesPanel } from "@/components/dashboard/sections/CoursesPanel";
import { StudentsPanel, FacultyPanel, SchedulePanel, AnalyticsPanel, MessagesPanel, AetherAIPanel } from "@/components/dashboard/sections/OtherPanels";
import type { Section } from "@/lib/dashboard/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Console — AetherCampus" },
      { name: "description", content: "The AetherCampus command center for intelligent universities." },
    ],
  }),
  component: Dashboard,
});

const nav: { icon: typeof Home; label: Section }[] = [
  { icon: Home, label: "Overview" },
  { icon: Users, label: "Students" },
  { icon: GraduationCap, label: "Faculty" },
  { icon: Calendar, label: "Schedule" },
  { icon: BookOpen, label: "Courses" },
  { icon: ChartBar, label: "Analytics" },
  { icon: Brain, label: "Aether AI" },
  { icon: MessageSquare, label: "Messages" },
];

const kpis = [
  { icon: Users, label: "Active students", val: "24,812", delta: "+4.2%", color: "from-primary/40 to-cyan/40" },
  { icon: GraduationCap, label: "Graduation rate", val: "94.1%", delta: "+1.8%", color: "from-cyan/40 to-violet/40" },
  { icon: BookOpen, label: "Courses live", val: "1,284", delta: "+12", color: "from-violet/40 to-primary/40" },
  { icon: Activity, label: "Engagement", val: "8.7/10", delta: "+0.3", color: "from-primary/40 to-violet/40" },
];

const series = [42, 55, 48, 70, 62, 78, 71, 85, 79, 92, 88, 95];

const heat = Array.from({ length: 7 * 16 }, (_, i) => Math.floor(Math.random() * 100));

function Dashboard() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pushNotification = useDashboard((s) => s.pushNotification);
  const activeSection = useDashboard((s) => s.activeSection);
  const setSection = useDashboard((s) => s.setSection);

  const initials = useMemo(() => {
    const name = user?.name ?? "Helena Voss";
    return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }, [user?.name]);

  // Cmd+K opens search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Simulate occasional realtime signals
  useEffect(() => {
    const id = setInterval(() => {
      const pool = [
        { title: "New AI insight", body: "Mentor pairing optimised for incoming cohort.", category: "ai" as const },
        { title: "Faculty update", body: "ECON dept submitted Q2 capacity plan.", category: "academic" as const },
        { title: "Engagement spike", body: "Library dashboard up 23% this hour.", category: "system" as const },
      ];
      const pick = pool[Math.floor(Math.random() * pool.length)];
      pushNotification(pick);
    }, 45_000);
    return () => clearInterval(id);
  }, [pushNotification]);

  async function handleLogout() {
    await logout();
    toast.success("Signed out.");
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/[0.06] p-4 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2">
          <div className="h-8 w-8 rounded-lg bg-aurora shadow-glow flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-foreground text-sm">
            Aether<span className="text-gradient">Campus</span>
          </span>
        </Link>

        <div className="mt-6 px-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg glass text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06]">⌘K</kbd>
          </button>
        </div>

        <nav className="mt-6 space-y-0.5">
          {nav.map((item) => (
            <button
              key={item.label}
              onClick={() => setSection(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.label ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
              {item.label === "Aether AI" && (
                <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded bg-aurora text-background">NEW</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl glass p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-8 w-8 rounded-full bg-aurora flex items-center justify-center text-xs font-semibold text-background">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{user?.name ?? "Helena Voss"}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{user?.role ?? "Provost"}</div>
            </div>
            <button onClick={handleLogout} aria-label="Sign out" className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Tuesday, March 18</div>
              <div className="text-sm font-semibold text-foreground tracking-tight">
                Good morning, {(user?.name ?? "Helena").split(" ")[0]}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="glass rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <Command className="h-3.5 w-3.5" /> Quick actions
                <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06]">⌘K</kbd>
              </button>
              <NotificationsButton />
              <button
                onClick={() => setAiOpen(true)}
                className="bg-foreground text-background rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5 hover:opacity-90"
              >
                <Zap className="h-3.5 w-3.5" /> Ask Aether
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 space-y-6 max-w-[1600px]">
          {activeSection !== "Overview" ? (
            <>
              {activeSection === "Students" && <StudentsPanel />}
              {activeSection === "Faculty" && <FacultyPanel />}
              {activeSection === "Schedule" && <SchedulePanel />}
              {activeSection === "Courses" && <CoursesPanel />}
              {activeSection === "Analytics" && <AnalyticsPanel />}
              {activeSection === "Aether AI" && <AetherAIPanel />}
              {activeSection === "Messages" && <MessagesPanel />}
            </>
          ) : (
          <>
          {/* AI insight banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass-strong p-5 flex items-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-aurora opacity-10" />
            <div className="relative h-10 w-10 rounded-xl bg-aurora flex items-center justify-center shrink-0 shadow-glow">
              <Brain className="h-5 w-5 text-background" />
            </div>
            <div className="relative flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-glow" /> Aether Insight
              </div>
              <div className="text-sm text-foreground mt-1 leading-relaxed">
                Predicted <span className="font-semibold">14% enrollment surge</span> in Computer Science next semester. I've drafted 3 new sections and identified 7 qualified TAs.
              </div>
            </div>
            <button
              onClick={() => setAiOpen(true)}
              className="relative shrink-0 text-xs font-medium px-3 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-foreground transition-colors"
            >
              Review plan
            </button>
          </motion.div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl glass p-5 relative overflow-hidden group"
              >
                <div className={`absolute -bottom-12 -right-12 h-32 w-32 bg-gradient-to-br ${k.color} opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity`} />
                <div className="relative flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg glass-strong flex items-center justify-center">
                    <k.icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
                  </div>
                  <span className="text-[10px] font-semibold text-cyan flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cyan/10">
                    {k.delta} <ArrowUpRight className="h-2.5 w-2.5" />
                  </span>
                </div>
                <div className="relative mt-5 text-3xl font-semibold text-foreground tracking-tight">{k.val}</div>
                <div className="relative text-xs text-muted-foreground mt-1">{k.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Chart + right column */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl glass p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-semibold text-foreground">Enrollment velocity</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Last 12 weeks — all faculties</div>
                </div>
                <div className="flex gap-1 text-[11px]">
                  {["1W", "1M", "3M", "1Y", "All"].map((p, i) => (
                    <button key={p} className={`px-2.5 py-1.5 rounded-md transition-colors ${i === 2 ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line chart */}
              <div className="relative h-64">
                <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.7 0.18 240)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="oklch(0.7 0.18 240)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="l" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="oklch(0.7 0.18 240)" />
                      <stop offset="100%" stopColor="oklch(0.82 0.14 210)" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1="0" x2="600" y1={i * 60 + 20} y2={i * 60 + 20} stroke="oklch(0.97 0.005 260 / 0.06)" />
                  ))}
                  {(() => {
                    const pts = series.map((v, i) => [i * (600 / 11), 220 - (v / 100) * 180] as const);
                    const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
                    const dArea = d + ` L600,240 L0,240 Z`;
                    return (
                      <>
                        <motion.path
                          d={dArea}
                          fill="url(#g)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                        <motion.path
                          d={d}
                          fill="none"
                          stroke="url(#l)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        />
                        {pts.map((p, i) => (
                          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="oklch(0.13 0.015 260)" stroke="oklch(0.82 0.14 210)" strokeWidth="2" />
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            <div className="rounded-2xl glass p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-semibold text-foreground">AI signals</div>
                <span className="text-[10px] text-muted-foreground">Live</span>
              </div>
              <div className="space-y-4">
                {[
                  { t: "Attendance anomaly", s: "CS-301 dropped 18% this week", c: "bg-cyan", time: "2m" },
                  { t: "Predicted overload", s: "Engineering — Q2 capacity at 112%", c: "bg-violet", time: "14m" },
                  { t: "New mentor match", s: "12 freshmen → senior mentors", c: "bg-primary", time: "1h" },
                  { t: "At-risk students", s: "7 require intervention", c: "bg-destructive", time: "3h" },
                ].map((a) => (
                  <div key={a.t} className="flex gap-3 group cursor-pointer">
                    <div className={`h-2 w-2 rounded-full mt-2 ${a.c} animate-pulse-glow shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-semibold text-foreground truncate">{a.t}</div>
                        <div className="text-[10px] text-muted-foreground">{a.time}</div>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{a.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Heatmap + activity */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl glass p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-sm font-semibold text-foreground">Attendance heatmap</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Past 16 weeks · 7 days</div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  Less
                  {[0.1, 0.25, 0.45, 0.7, 1].map((o) => (
                    <div key={o} className="h-2.5 w-2.5 rounded-sm" style={{ background: `oklch(0.7 0.18 240 / ${o})` }} />
                  ))}
                  More
                </div>
              </div>
              <div className="grid grid-cols-16 gap-1" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
                {heat.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.003 }}
                    className="aspect-square rounded-sm"
                    style={{ background: `oklch(0.7 0.18 240 / ${0.08 + (v / 100) * 0.7})` }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl glass p-6">
              <div className="text-sm font-semibold text-foreground mb-5">Today's schedule</div>
              <div className="space-y-3">
                {[
                  { t: "09:00", title: "Board sync", desc: "Strategy room · 8 attendees" },
                  { t: "11:30", title: "Faculty review", desc: "Engineering dept." },
                  { t: "14:00", title: "AI rollout — phase 2", desc: "All-hands campus" },
                  { t: "16:30", title: "Student council", desc: "Live Q&A" },
                ].map((e) => (
                  <div key={e.title} className="flex gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <div className="text-xs font-mono text-cyan w-10 shrink-0 mt-0.5">{e.t}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{e.title}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{e.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks + Activity */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TasksWidget />
            </div>
            <div className="rounded-2xl glass p-6">
              <div className="text-sm font-semibold text-foreground mb-4">Activity feed</div>
              <div className="space-y-4">
                {[
                  { who: "Maya O.", what: "approved CS-220 syllabus", when: "2m" },
                  { who: "Aether AI", what: "rebalanced room assignments", when: "11m" },
                  { who: "Dr. Chen", what: "submitted faculty report", when: "1h" },
                  { who: "System", what: "ingested 412 new applications", when: "3h" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className="h-6 w-6 rounded-full bg-aurora/40 flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0">
                      {a.who[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground">
                        <span className="font-semibold">{a.who}</span> {a.what}
                      </div>
                      <div className="text-muted-foreground mt-0.5">{a.when} ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </main>

      <AIAssistantPanel open={aiOpen} onClose={() => setAiOpen(false)} />
      <CommandPalette open={searchOpen} query={query} setQuery={setQuery} onClose={() => setSearchOpen(false)} onAskAI={() => { setSearchOpen(false); setAiOpen(true); }} onGoto={(s) => { setSection(s); setSearchOpen(false); }} />
    </div>
  );
}

function CommandPalette({
  open,
  query,
  setQuery,
  onClose,
  onAskAI,
  onGoto,
}: {
  open: boolean;
  query: string;
  setQuery: (q: string) => void;
  onClose: () => void;
  onAskAI: () => void;
  onGoto: (s: Section) => void;
}) {
  const items: { label: string; group: string; icon: typeof Users; onSelect?: () => void }[] = [
    { label: "View students", group: "Navigate", icon: Users, onSelect: () => onGoto("Students") },
    { label: "Open analytics", group: "Navigate", icon: ChartBar, onSelect: () => onGoto("Analytics") },
    { label: "Manage schedule", group: "Navigate", icon: Calendar, onSelect: () => onGoto("Schedule") },
    { label: "Course catalog", group: "Navigate", icon: BookOpen, onSelect: () => onGoto("Courses") },
    { label: "Faculty directory", group: "Navigate", icon: GraduationCap, onSelect: () => onGoto("Faculty") },
    { label: "Messages inbox", group: "Navigate", icon: MessageSquare, onSelect: () => onGoto("Messages") },
    { label: "Ask Aether AI", group: "Actions", icon: Brain, onSelect: onAskAI },
    { label: "Open Aether console", group: "Actions", icon: Brain, onSelect: () => onGoto("Aether AI") },
    { label: "Invite team member", group: "Actions", icon: Zap },
    { label: "Account settings", group: "Account", icon: Settings },
  ];
  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-32 px-4 bg-background/60 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl glass-strong rounded-2xl shadow-elev overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, courses, actions…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-auto p-2">
          {filtered.length === 0 && (
            <div className="px-3 py-10 text-center text-xs text-muted-foreground">No matches for "{query}"</div>
          )}
          {filtered.map((i) => (
            <button
              key={i.label}
              onClick={() => {
                if (i.onSelect) i.onSelect();
                else onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] text-left transition-colors"
            >
              <i.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
              <span className="text-sm text-foreground flex-1">{i.label}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{i.group}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}