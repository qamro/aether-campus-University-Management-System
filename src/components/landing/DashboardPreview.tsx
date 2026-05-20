import { motion } from "framer-motion";
import { Activity, ArrowUpRight, GraduationCap, Users, BookOpen, Bell } from "lucide-react";
import { SectionHeader } from "./Features";

const bars = [42, 68, 55, 82, 70, 91, 78, 64, 88, 72, 95, 80];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-32 relative">
      <div className="container max-w-6xl mx-auto px-6">
        <SectionHeader
          eyebrow="The Console"
          title={<>A campus command center,<br /><span className="text-muted-foreground">engineered like a flagship product.</span></>}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="absolute -inset-6 bg-aurora opacity-30 blur-[100px] -z-10" />
          <div className="rounded-2xl glass-strong shadow-elev overflow-hidden">
            {/* window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <div className="ml-4 px-3 py-1 rounded-md text-xs text-muted-foreground bg-white/[0.04]">aether.app/console</div>
            </div>

            <div className="grid grid-cols-12 gap-4 p-5">
              {/* sidebar */}
              <div className="col-span-2 hidden md:flex flex-col gap-1">
                {["Overview", "Students", "Faculty", "Schedule", "Analytics", "AI"].map((l, i) => (
                  <div key={l} className={`px-3 py-2 rounded-lg text-xs ${i === 0 ? "bg-white/[0.06] text-foreground" : "text-muted-foreground"}`}>
                    {l}
                  </div>
                ))}
              </div>

              {/* main */}
              <div className="col-span-12 md:col-span-10 space-y-4">
                {/* KPI row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { icon: Users, label: "Active students", val: "24,812", delta: "+4.2%" },
                    { icon: GraduationCap, label: "Graduation rate", val: "94.1%", delta: "+1.8%" },
                    { icon: BookOpen, label: "Courses live", val: "1,284", delta: "+12" },
                    { icon: Activity, label: "Engagement", val: "8.7/10", delta: "+0.3" },
                  ].map((k) => (
                    <div key={k.label} className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <k.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                        <span className="text-[10px] font-medium text-cyan flex items-center gap-0.5">
                          {k.delta} <ArrowUpRight className="h-2.5 w-2.5" />
                        </span>
                      </div>
                      <div className="mt-3 text-xl font-semibold text-foreground tracking-tight">{k.val}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{k.label}</div>
                    </div>
                  ))}
                </div>

                {/* chart + side */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-2 rounded-xl p-5 bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="text-sm font-semibold text-foreground">Enrollment velocity</div>
                        <div className="text-xs text-muted-foreground">Last 12 weeks</div>
                      </div>
                      <div className="flex gap-1 text-[10px]">
                        {["1W", "1M", "3M", "1Y"].map((p, i) => (
                          <span key={p} className={`px-2 py-1 rounded-md ${i === 2 ? "bg-white/[0.08] text-foreground" : "text-muted-foreground"}`}>{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-40">
                      {bars.map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-primary/40 via-cyan/60 to-cyan relative"
                        >
                          {i === 10 && (
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-medium text-foreground glass rounded-md px-1.5 py-0.5">
                              95%
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl p-5 bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-semibold text-foreground">AI signals</div>
                      <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="space-y-3">
                      {[
                        { t: "Attendance anomaly", s: "CS-301 ⋅ 2 min ago", c: "bg-cyan" },
                        { t: "Predicted overload", s: "Engineering Q2", c: "bg-violet" },
                        { t: "New mentor match", s: "12 students", c: "bg-primary" },
                      ].map((a) => (
                        <div key={a.t} className="flex gap-3">
                          <div className={`h-1.5 w-1.5 rounded-full mt-1.5 ${a.c} animate-pulse-glow`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-foreground truncate">{a.t}</div>
                            <div className="text-[11px] text-muted-foreground">{a.s}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}