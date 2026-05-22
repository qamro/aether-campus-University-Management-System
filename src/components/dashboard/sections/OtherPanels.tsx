import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, X, AlertTriangle, ChevronLeft, ChevronRight, Send, Archive, Brain, Sparkles, Star, Mail, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboard } from "@/lib/dashboard/store";
import {
  studentsApi, facultyApi, scheduleApi, messagesApi, analyticsApi, aiApi,
  type Student, type StudentStatus, type Faculty, type FacultyAvailability,
  type ScheduleEvent, type EventCategory, type AnalyticsSnapshot, type TimeRange,
} from "@/lib/mock-api";
import { useCoursesData, useDebounced, useFacultyData, useScheduleData, useStudentsData, useThreadsData } from "@/lib/dashboard/hooks";
import { SectionShell, LoadingState, EmptyState } from "./SectionShell";

/* ─────────── Students ─────────── */
const sStatusColor: Record<StudentStatus, string> = {
  active: "bg-cyan/15 text-cyan", probation: "bg-destructive/20 text-destructive",
  graduated: "bg-violet/15 text-violet", leave: "bg-muted-foreground/15 text-muted-foreground",
};
const PAGE = 12;
export function StudentsPanel() {
  const { students, loaded } = useStudentsData();
  const upsert = useDashboard((s) => s.upsertStudent);
  const remove = useDashboard((s) => s.deleteStudents);
  const [q, setQ] = useState(""); const dq = useDebounced(q, 200);
  const [program, setProgram] = useState("all"); const [year, setYear] = useState("all"); const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0); const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view, setView] = useState<Student | null>(null); const [newOpen, setNewOpen] = useState(false);
  const programs = useMemo(() => Array.from(new Set(students.map((s) => s.program))), [students]);
  const filtered = useMemo(() => students.filter((s) => {
    if (program !== "all" && s.program !== program) return false;
    if (year !== "all" && String(s.year) !== year) return false;
    if (status !== "all" && s.status !== status) return false;
    if (dq) { const v = dq.toLowerCase(); if (!s.name.toLowerCase().includes(v) && !s.email.toLowerCase().includes(v)) return false; }
    return true;
  }), [students, dq, program, year, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const slice = filtered.slice(page * PAGE, page * PAGE + PAGE);
  function toggle(id: string) { setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  async function bulkRemove() {
    const ids = Array.from(selected); remove(ids); setSelected(new Set());
    await studentsApi.bulkRemove(ids); toast.success(`${ids.length} students removed`);
  }
  return (
    <SectionShell title="Students" subtitle={`${students.length} enrolled · ${students.filter((s) => s.riskScore > 60).length} at-risk`} insightSection="Students"
      actions={<>
        {selected.size > 0 && <button onClick={bulkRemove} className="text-xs px-3 py-2 rounded-lg bg-destructive/15 text-destructive font-medium inline-flex items-center gap-1.5"><Trash2 className="h-3.5 w-3.5" />Remove {selected.size}</button>}
        <button onClick={() => setNewOpen(true)} className="bg-foreground text-background rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" />Add student</button>
      </>}
    >
      <div className="rounded-2xl glass p-4 flex flex-wrap gap-2">
        <div className="flex-1 min-w-60 flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search students…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <select value={program} onChange={(e) => { setProgram(e.target.value); setPage(0); }} className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs"><option value="all">All programs</option>{programs.map((p) => <option key={p}>{p}</option>)}</select>
        <select value={year} onChange={(e) => { setYear(e.target.value); setPage(0); }} className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs"><option value="all">All years</option>{[1,2,3,4,5].map((y) => <option key={y} value={y}>Year {y}</option>)}</select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs"><option value="all">All status</option><option value="active">Active</option><option value="probation">Probation</option><option value="leave">On leave</option></select>
      </div>
      {!loaded ? <LoadingState /> : filtered.length === 0 ? <EmptyState label="No students match these filters." /> : (
        <div className="rounded-2xl glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left p-3 w-8"><input type="checkbox" checked={slice.length > 0 && slice.every((s) => selected.has(s.id))} onChange={(e) => setSelected((cur) => { const n = new Set(cur); slice.forEach((s) => e.target.checked ? n.add(s.id) : n.delete(s.id)); return n; })} /></th>
                <th className="text-left p-3">Student</th><th className="text-left p-3">Program</th><th className="text-left p-3">Year</th>
                <th className="text-left p-3">GPA</th><th className="text-left p-3">Attendance</th><th className="text-left p-3">Status</th><th className="text-left p-3">Risk</th>
              </tr></thead>
              <tbody>
                {slice.map((s) => (
                  <tr key={s.id} onClick={() => setView(s)} className="border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer transition-colors">
                    <td className="p-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} /></td>
                    <td className="p-3"><div className="flex items-center gap-2.5"><div className="h-8 w-8 rounded-full bg-aurora/40 flex items-center justify-center text-[10px] font-semibold">{s.name.split(" ").map((n) => n[0]).join("")}</div><div><div className="text-xs font-medium text-foreground">{s.name}</div><div className="text-[10px] text-muted-foreground">{s.email}</div></div></div></td>
                    <td className="p-3 text-xs text-muted-foreground">{s.program}</td><td className="p-3 text-xs">Y{s.year}</td>
                    <td className="p-3 text-xs font-mono">{s.gpa.toFixed(2)}</td><td className="p-3 text-xs">{s.attendance}%</td>
                    <td className="p-3"><span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${sStatusColor[s.status]}`}>{s.status}</span></td>
                    <td className="p-3"><div className="flex items-center gap-1.5"><div className="h-1.5 w-12 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full" style={{ width: `${s.riskScore}%`, background: s.riskScore > 60 ? "var(--destructive)" : s.riskScore > 30 ? "var(--cyan)" : "var(--primary)" }} /></div><span className="text-[10px] text-muted-foreground">{s.riskScore}</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] text-xs text-muted-foreground">
            <span>Page {page + 1} of {pages} · {filtered.length} results</span>
            <div className="flex gap-1"><button disabled={page===0} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-md hover:bg-white/[0.06] disabled:opacity-30"><ChevronLeft className="h-3.5 w-3.5" /></button><button disabled={page>=pages-1} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-md hover:bg-white/[0.06] disabled:opacity-30"><ChevronRight className="h-3.5 w-3.5" /></button></div>
          </div>
        </div>
      )}
      <AnimatePresence>{view && (
        <div onClick={() => setView(null)} className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="w-full max-w-xl glass-strong rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-start"><div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-aurora flex items-center justify-center text-sm font-semibold text-background">{view.name.split(" ").map((n) => n[0]).join("")}</div><div><div className="text-base font-semibold">{view.name}</div><div className="text-xs text-muted-foreground">{view.email}</div></div></div><button onClick={() => setView(null)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[["GPA",view.gpa.toFixed(2)],["Attendance",`${view.attendance}%`],["Year",`Y${view.year}`],["Risk",`${view.riskScore}`]].map(([l,v]) => <div key={l} className="rounded-lg glass p-3"><div className="text-lg font-semibold">{v}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div></div>)}
            </div>
            <div className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Program · </span>{view.program}</div>
            <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Enrolled courses</div><div className="flex flex-wrap gap-1.5">{view.enrolledCourses.map((c) => <span key={c} className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.06]">{c}</span>)}</div></div>
            {view.riskScore > 60 && <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex gap-2 text-xs"><AlertTriangle className="h-4 w-4 text-destructive shrink-0" /><span>High-risk: schedule intervention with academic advisor.</span></div>}
          </motion.div>
        </div>
      )}</AnimatePresence>
      <AnimatePresence>{newOpen && <NewStudentModal onClose={() => setNewOpen(false)} onCreate={async (data) => { const c = await studentsApi.create(data); upsert(c); toast.success("Student added"); setNewOpen(false); }} />}</AnimatePresence>
    </SectionShell>
  );
}
function NewStudentModal({ onClose, onCreate }: { onClose: () => void; onCreate: (data: Omit<Student, "id" | "riskScore">) => void }) {
  const [f, setF] = useState({ name: "", email: "", program: "Computer Science", year: 1 as Student["year"], gpa: 3.0, attendance: 90, status: "active" as StudentStatus, enrolledCourses: [] as string[] });
  const inp = "w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm outline-none";
  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="w-full max-w-md glass-strong rounded-2xl p-6 space-y-3">
        <div className="flex justify-between"><h3 className="text-base font-semibold">Add student</h3><button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button></div>
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Full name" className={inp} />
        <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Email" className={inp} />
        <input value={f.program} onChange={(e) => setF({ ...f, program: e.target.value })} placeholder="Program" className={inp} />
        <div className="grid grid-cols-2 gap-2">
          <select value={f.year} onChange={(e) => setF({ ...f, year: +e.target.value as Student["year"] })} className={inp}>{[1,2,3,4,5].map((y) => <option key={y} value={y}>Year {y}</option>)}</select>
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as StudentStatus })} className={inp}><option value="active">Active</option><option value="probation">Probation</option><option value="leave">On leave</option></select>
        </div>
        <div className="flex justify-end gap-2"><button onClick={onClose} className="px-3 py-2 text-xs text-muted-foreground">Cancel</button><button onClick={() => onCreate(f)} disabled={!f.name || !f.email} className="px-3 py-2 text-xs rounded-lg bg-foreground text-background font-medium disabled:opacity-40">Add</button></div>
      </motion.div>
    </div>
  );
}

/* ─────────── Faculty ─────────── */
const fAvail: Record<FacultyAvailability, string> = { available: "bg-cyan/15 text-cyan", "in-class": "bg-violet/15 text-violet", "on-leave": "bg-muted-foreground/15 text-muted-foreground" };
export function FacultyPanel() {
  const { faculty, loaded } = useFacultyData();
  const { courses } = useCoursesData();
  const patchF = useDashboard((s) => s.patchFaculty);
  const [q, setQ] = useState(""); const dq = useDebounced(q, 200);
  const [dept, setDept] = useState("all"); const [view, setView] = useState<Faculty | null>(null);
  const depts = useMemo(() => Array.from(new Set(faculty.map((f) => f.department))), [faculty]);
  const filtered = useMemo(() => faculty.filter((f) => (dept === "all" || f.department === dept) && (!dq || f.name.toLowerCase().includes(dq.toLowerCase()))), [faculty, dq, dept]);
  async function assign(facultyId: string, courseId: string) {
    const f = faculty.find((x) => x.id === facultyId); if (!f) return;
    const has = f.courseIds.includes(courseId);
    patchF(facultyId, { courseIds: has ? f.courseIds.filter((c) => c !== courseId) : [...f.courseIds, courseId] });
    has ? await facultyApi.unassignCourse(facultyId, courseId) : await facultyApi.assignCourse(facultyId, courseId);
    toast.success(has ? "Course unassigned" : "Course assigned");
  }
  return (
    <SectionShell title="Faculty" subtitle={`${faculty.length} members across ${depts.length} departments`} insightSection="Faculty">
      <div className="rounded-2xl glass p-4 flex flex-wrap gap-2">
        <div className="flex-1 min-w-60 flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2"><Search className="h-3.5 w-3.5 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search faculty…" className="flex-1 bg-transparent text-sm outline-none" /></div>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs"><option value="all">All departments</option>{depts.map((d) => <option key={d}>{d}</option>)}</select>
      </div>
      {!loaded ? <LoadingState /> : filtered.length === 0 ? <EmptyState label="No faculty match." /> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <motion.div key={f.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={() => setView(f)} className="rounded-2xl glass p-5 cursor-pointer hover:bg-white/[0.05] transition-colors">
              <div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="h-11 w-11 rounded-full bg-aurora/50 flex items-center justify-center text-sm font-semibold">{f.name.split(" ").slice(-1)[0][0]}</div><div><div className="text-sm font-semibold">{f.name}</div><div className="text-[11px] text-muted-foreground">{f.title}</div></div></div><span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${fAvail[f.availability]}`}>{f.availability}</span></div>
              <div className="mt-3 text-xs text-muted-foreground">{f.department}</div>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground"><span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-cyan" />{f.rating.toFixed(1)}</span><span>·</span><span>{f.publications} pubs</span></div>
              <div className="mt-3 flex flex-wrap gap-1">{f.courseIds.map((cid) => { const c = courses.find((x) => x.id === cid); return <span key={cid} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06]">{c?.code ?? cid}</span>; })}</div>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>{view && (
        <div onClick={() => setView(null)} className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="w-full max-w-xl glass-strong rounded-2xl p-6 space-y-5">
            <div className="flex justify-between"><div className="flex items-center gap-3"><div className="h-12 w-12 rounded-full bg-aurora flex items-center justify-center text-sm font-semibold text-background">{view.name.split(" ").slice(-1)[0][0]}</div><div><div className="text-base font-semibold">{view.name}</div><div className="text-xs text-muted-foreground">{view.title} · {view.department}</div></div></div><button onClick={() => setView(null)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5" />{view.email}</div>
            <div className="grid grid-cols-3 gap-3">{[["Rating",view.rating.toFixed(1)],["Publications",view.publications],["Courses",view.courseIds.length]].map(([l,v]) => <div key={l} className="rounded-lg glass p-3"><div className="text-lg font-semibold">{v}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div></div>)}</div>
            <div><div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Assign courses</div><div className="flex flex-wrap gap-1.5 max-h-40 overflow-auto">{courses.map((c) => { const on = view.courseIds.includes(c.id); return <button key={c.id} onClick={() => assign(view.id, c.id)} className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${on ? "bg-aurora text-background" : "bg-white/[0.06] text-muted-foreground hover:text-foreground"}`}>{c.code}</button>; })}</div></div>
          </motion.div>
        </div>
      )}</AnimatePresence>
    </SectionShell>
  );
}

/* ─────────── Schedule ─────────── */
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => 8 + i);
const catColor: Record<EventCategory, string> = { lecture: "from-primary/60 to-cyan/40 border-primary/40", exam: "from-destructive/60 to-destructive/30 border-destructive/40", meeting: "from-violet/60 to-violet/30 border-violet/40", lab: "from-cyan/60 to-cyan/30 border-cyan/40" };
export function SchedulePanel() {
  const { schedule, loaded } = useScheduleData();
  const upsert = useDashboard((s) => s.upsertEvent); const remove = useDashboard((s) => s.deleteEvent);
  const [weekOffset, setWeekOffset] = useState(0);
  const [edit, setEdit] = useState<ScheduleEvent | "new" | null>(null);
  const conflicts = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < schedule.length; i++) for (let j = i + 1; j < schedule.length; j++) {
      const a = schedule[i], b = schedule[j];
      if (a.day === b.day && a.start < b.start + b.duration && b.start < a.start + a.duration) { set.add(a.id); set.add(b.id); }
    }
    return set;
  }, [schedule]);
  async function save(e: Omit<ScheduleEvent, "id">, id?: string) {
    if (id) { upsert({ ...e, id }); await scheduleApi.update(id, e); toast.success("Updated"); }
    else { const c = await scheduleApi.create(e); upsert(c); toast.success("Created"); }
    setEdit(null);
  }
  async function del(id: string) { remove(id); await scheduleApi.remove(id); toast.success("Removed"); }
  return (
    <SectionShell title="Schedule" subtitle={`Week ${weekOffset===0?"current":weekOffset>0?`+${weekOffset}`:weekOffset} · ${schedule.length} events`} insightSection="Schedule"
      actions={<>
        <div className="flex items-center gap-1">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 rounded-lg glass hover:bg-white/[0.06]"><ChevronLeft className="h-3.5 w-3.5" /></button>
          <button onClick={() => setWeekOffset(0)} className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground">Today</button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-2 rounded-lg glass hover:bg-white/[0.06]"><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
        <button onClick={() => setEdit("new")} className="bg-foreground text-background rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" />New event</button>
      </>}
    >
      {conflicts.size > 0 && <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3 flex items-center gap-2 text-xs"><AlertTriangle className="h-4 w-4 text-destructive" />{conflicts.size / 2} schedule conflict{conflicts.size > 2 ? "s" : ""} detected.</div>}
      {!loaded ? <LoadingState /> : (
        <div className="rounded-2xl glass p-4 overflow-x-auto">
          <div className="min-w-[760px] relative">
            <div className="grid" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
              <div />{DAYS.map((d) => <div key={d} className="text-[11px] uppercase tracking-wider text-muted-foreground p-2 text-center">{d}</div>)}
              {HOURS.map((h) => (
                <div key={h} className="contents">
                  <div className="text-[10px] text-muted-foreground p-1 text-right font-mono">{h.toString().padStart(2,"0")}:00</div>
                  {DAYS.map((_, di) => (
                    <div key={`${h}-${di}`} className="border-t border-white/[0.04] h-14 hover:bg-white/[0.02] cursor-pointer"
                      onClick={() => setEdit({ id: "", title: "", category: "lecture", day: di as ScheduleEvent["day"], start: h, duration: 1, location: "" })}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="absolute top-9 left-[60px] right-0 bottom-0 pointer-events-none grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {DAYS.map((_, di) => (
                <div key={di} className="relative">
                  {schedule.filter((e) => e.day === di).map((e) => (
                    <motion.button key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      onClick={(ev) => { ev.stopPropagation(); setEdit(e); }}
                      className={`pointer-events-auto absolute left-1 right-1 rounded-lg p-1.5 text-left bg-gradient-to-br ${catColor[e.category]} border ${conflicts.has(e.id) ? "ring-1 ring-destructive" : ""}`}
                      style={{ top: `${(e.start - 8) * 56}px`, height: `${e.duration * 56 - 4}px` }}
                    >
                      <div className="text-[10px] font-semibold truncate">{e.title}</div>
                      <div className="text-[9px] text-foreground/70 truncate">{e.location}</div>
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>{edit && <EventModal event={edit === "new" ? null : edit} onClose={() => setEdit(null)} onSave={save} onDelete={del} />}</AnimatePresence>
    </SectionShell>
  );
}
function EventModal({ event, onClose, onSave, onDelete }: { event: ScheduleEvent | null; onClose: () => void; onSave: (e: Omit<ScheduleEvent, "id">, id?: string) => void; onDelete: (id: string) => void }) {
  const [f, setF] = useState<Omit<ScheduleEvent, "id">>({ title: event?.title ?? "", category: event?.category ?? "lecture", day: event?.day ?? 0, start: event?.start ?? 9, duration: event?.duration ?? 1, location: event?.location ?? "", facultyId: event?.facultyId, courseId: event?.courseId });
  const inp = "w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm outline-none";
  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="w-full max-w-md glass-strong rounded-2xl p-6 space-y-3">
        <div className="flex justify-between"><h3 className="text-base font-semibold">{event?.id ? "Edit event" : "New event"}</h3><button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button></div>
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title" className={inp} />
        <input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="Location" className={inp} />
        <div className="grid grid-cols-2 gap-2">
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as EventCategory })} className={inp}><option value="lecture">Lecture</option><option value="lab">Lab</option><option value="exam">Exam</option><option value="meeting">Meeting</option></select>
          <select value={f.day} onChange={(e) => setF({ ...f, day: +e.target.value as ScheduleEvent["day"] })} className={inp}>{DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}</select>
          <input type="number" min={8} max={20} value={f.start} onChange={(e) => setF({ ...f, start: +e.target.value })} className={inp} />
          <input type="number" min={0.5} step={0.5} max={6} value={f.duration} onChange={(e) => setF({ ...f, duration: +e.target.value })} className={inp} />
        </div>
        <div className="flex justify-between gap-2 pt-2">
          {event?.id ? <button onClick={() => { onDelete(event.id); onClose(); }} className="text-xs text-destructive inline-flex items-center gap-1"><Trash2 className="h-3 w-3" />Delete</button> : <span />}
          <div className="flex gap-2"><button onClick={onClose} className="px-3 py-2 text-xs text-muted-foreground">Cancel</button><button onClick={() => onSave(f, event?.id || undefined)} disabled={!f.title} className="px-3 py-2 text-xs rounded-lg bg-foreground text-background font-medium disabled:opacity-40">Save</button></div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────── Analytics ─────────── */
const ranges: TimeRange[] = ["day","week","month","year"];
function formatVal(v: number, fmt: string) { if (fmt === "pct") return v.toFixed(1) + "%"; if (fmt === "score") return v.toFixed(1); return Math.round(v).toLocaleString(); }
function Counter({ value, format }: { value: number; format: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now(); const from = v, to = value, dur = 700; let raf = 0;
    const step = (t: number) => { const p = Math.min(1, (t - start) / dur); setV(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span>{formatVal(v, format)}</span>;
}
export function AnalyticsPanel() {
  const [range, setRange] = useState<TimeRange>("week");
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { let alive = true; setLoading(true); analyticsApi.snapshot(range).then((d) => { if (alive) { setData(d); setLoading(false); } }); return () => { alive = false; }; }, [range]);
  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => d ? { ...d, kpis: d.kpis.map((k) => ({ ...k, value: k.format === "int" ? k.value + Math.floor(Math.random() * 5) : +(k.value + (Math.random() - 0.5) * 0.05).toFixed(2) })) } : d);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <SectionShell title="Analytics" subtitle="Real-time campus performance signals" insightSection="Analytics"
      actions={<div className="flex gap-1 text-[11px]">{ranges.map((r) => <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1.5 rounded-md capitalize transition-colors ${range === r ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{r}</button>)}</div>}
    >
      {loading || !data ? <LoadingState /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.kpis.map((k) => {
              const delta = ((k.value - k.previous) / k.previous) * 100; const up = delta >= 0;
              return (
                <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl glass p-5">
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight"><Counter value={k.value} format={k.format} /></div>
                  <div className={`mt-1 text-[11px] inline-flex items-center gap-0.5 ${up ? "text-cyan" : "text-destructive"}`}>{up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{Math.abs(delta).toFixed(1)}% vs last {range}</div>
                </motion.div>
              );
            })}
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl glass p-5">
              <div className="text-sm font-semibold mb-3">Enrollment trend</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.enrollment}>
                    <defs>
                      <linearGradient id="cur" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.7 0.18 240)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.7 0.18 240)" stopOpacity={0} /></linearGradient>
                      <linearGradient id="prev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.65 0.22 295)" stopOpacity={0.35} /><stop offset="100%" stopColor="oklch(0.65 0.22 295)" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.97 0.005 260 / 0.06)" vertical={false} />
                    <XAxis dataKey="label" stroke="oklch(0.68 0.02 260)" fontSize={10} />
                    <YAxis stroke="oklch(0.68 0.02 260)" fontSize={10} />
                    <Tooltip contentStyle={{ background: "oklch(0.17 0.018 260)", border: "1px solid oklch(0.97 0.005 260 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="previous" stroke="oklch(0.65 0.22 295)" fill="url(#prev)" strokeWidth={2} />
                    <Area type="monotone" dataKey="current" stroke="oklch(0.7 0.18 240)" fill="url(#cur)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl glass p-5">
              <div className="text-sm font-semibold mb-3">Department split</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.departmentSplit}>
                    <CartesianGrid stroke="oklch(0.97 0.005 260 / 0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="oklch(0.68 0.02 260)" fontSize={9} interval={0} angle={-25} textAnchor="end" height={50} />
                    <YAxis stroke="oklch(0.68 0.02 260)" fontSize={10} />
                    <Tooltip contentStyle={{ background: "oklch(0.17 0.018 260)", border: "1px solid oklch(0.97 0.005 260 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" fill="oklch(0.82 0.14 210)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </SectionShell>
  );
}

/* ─────────── Messages ─────────── */
function timeAgo(ts: number) { const s = Math.floor((Date.now() - ts) / 1000); if (s < 60) return "now"; if (s < 3600) return Math.floor(s/60) + "m"; if (s < 86400) return Math.floor(s/3600) + "h"; return Math.floor(s/86400) + "d"; }
export function MessagesPanel() {
  const { threads, loaded } = useThreadsData();
  const activeId = useDashboard((s) => s.activeThreadId); const setActive = useDashboard((s) => s.setActiveThread);
  const append = useDashboard((s) => s.appendThreadMessage); const markRead = useDashboard((s) => s.markThreadRead);
  const toggleArchive = useDashboard((s) => s.toggleArchiveThread);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [q, setQ] = useState(""); const [draft, setDraft] = useState("");
  useEffect(() => { if (!activeId && threads.length) setActive(threads[0].id); }, [activeId, threads, setActive]);
  const list = useMemo(() => threads.filter((t) => {
    if (filter === "unread" && !t.unread) return false;
    if (filter === "archived" && !t.archived) return false;
    if (filter === "all" && t.archived) return false;
    if (q && !t.subject.toLowerCase().includes(q.toLowerCase()) && !t.participant.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.updatedAt - a.updatedAt), [threads, filter, q]);
  const active = threads.find((t) => t.id === activeId);
  async function send() {
    if (!draft.trim() || !active) return;
    const content = draft.trim(); setDraft("");
    const msg = await messagesApi.send(active.id, content); append(active.id, msg);
    setTimeout(async () => { const reply = await messagesApi.reply(active.id); append(active.id, reply); }, 900);
  }
  return (
    <SectionShell title="Messages" subtitle={`${threads.filter((t) => t.unread).length} unread`} insightSection="Messages">
      {!loaded ? <LoadingState /> : (
        <div className="rounded-2xl glass overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[560px]">
          <div className="border-r border-white/[0.06] flex flex-col">
            <div className="p-3 border-b border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-1.5"><Search className="h-3 w-3 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 bg-transparent text-xs outline-none" /></div>
              <div className="flex gap-1 text-[10px]">{(["all","unread","archived"] as const).map((f) => <button key={f} onClick={() => setFilter(f)} className={`px-2 py-1 rounded-md capitalize ${filter===f?"bg-white/[0.08] text-foreground":"text-muted-foreground"}`}>{f}</button>)}</div>
            </div>
            <div className="flex-1 overflow-auto">
              {list.map((t) => (
                <button key={t.id} onClick={() => { setActive(t.id); markRead(t.id); }} className={`w-full text-left p-3 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors ${activeId===t.id?"bg-white/[0.05]":""}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-aurora/40 flex items-center justify-center text-[10px] font-semibold">{t.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2"><div className={`text-xs truncate ${t.unread?"text-foreground font-semibold":"text-foreground/80"}`}>{t.participant}</div><div className="text-[9px] text-muted-foreground">{timeAgo(t.updatedAt)}</div></div>
                      <div className="text-[11px] text-muted-foreground truncate">{t.subject}</div>
                      <div className="text-[10px] text-muted-foreground/70 truncate mt-0.5">{t.preview}</div>
                    </div>
                    {t.unread && <div className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-glow shrink-0" />}
                  </div>
                </button>
              ))}
              {list.length === 0 && <div className="p-8 text-center text-xs text-muted-foreground">No conversations</div>}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            {active ? (<>
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between"><div><div className="text-sm font-semibold">{active.subject}</div><div className="text-[11px] text-muted-foreground">with {active.participant}</div></div><button onClick={() => toggleArchive(active.id)} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Archive className="h-3 w-3" />{active.archived?"Unarchive":"Archive"}</button></div>
              <div className="flex-1 overflow-auto p-5 space-y-3">
                <AnimatePresence initial={false}>{active.messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${m.fromSelf?"flex-row-reverse":""}`}>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${m.fromSelf?"bg-foreground text-background":"bg-aurora/40 text-foreground"}`}>{m.authorInitials}</div>
                    <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-xs ${m.fromSelf?"bg-foreground text-background":"glass text-foreground"}`}>{m.content}<div className={`text-[9px] mt-1 ${m.fromSelf?"text-background/60":"text-muted-foreground"}`}>{new Date(m.createdAt).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}</div></div>
                  </motion.div>
                ))}</AnimatePresence>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-white/[0.06] p-3 flex gap-2"><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm outline-none" /><button type="submit" disabled={!draft.trim()} className="h-9 w-9 rounded-lg bg-foreground text-background flex items-center justify-center disabled:opacity-40"><Send className="h-4 w-4" /></button></form>
            </>) : <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Select a conversation</div>}
          </div>
        </div>
      )}
    </SectionShell>
  );
}

/* ─────────── Aether AI ─────────── */
const quick = ["Forecast next-semester enrollment", "Identify at-risk students", "Audit faculty utilisation", "Summarise this week's signals"];
export function AetherAIPanel() {
  const chat = useDashboard((s) => s.chat);
  const append = useDashboard((s) => s.appendMessage);
  const patch = useDashboard((s) => s.patchMessage);
  const clear = useDashboard((s) => s.clearChat);
  const section = useDashboard((s) => s.activeSection);
  const [input, setInput] = useState(""); const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat.length, thinking]);
  async function send(prompt: string) {
    if (!prompt.trim() || thinking) return;
    append({ role: "user", content: prompt }); setInput(""); setThinking(true);
    append({ role: "ai", content: "", streaming: true });
    setTimeout(async () => {
      const last = useDashboard.getState().chat.slice(-1)[0];
      let acc = "";
      for await (const chunk of aiApi.stream(prompt, section)) { acc += chunk; patch(last.id, { content: acc }); }
      patch(last.id, { streaming: false }); setThinking(false);
    }, 0);
  }
  return (
    <SectionShell title="Aether AI" subtitle="A contextual intelligence layer for every campus signal" insightSection="Overview"
      actions={<button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Trash2 className="h-3 w-3" />Clear</button>}
    >
      <div className="rounded-2xl glass overflow-hidden grid md:grid-cols-[1fr_280px] h-[600px]">
        <div className="flex flex-col min-w-0">
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {chat.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${m.role==="user"?"flex-row-reverse":""}`}>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${m.role==="ai"?"bg-aurora":"glass-strong"}`}>{m.role==="ai" ? <Sparkles className="h-4 w-4 text-background" /> : <span className="text-[10px] font-bold">HV</span>}</div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role==="ai"?"glass":"bg-foreground text-background"}`}>
                  {m.content || (m.streaming ? "…" : "")}
                  {m.streaming && <span className="inline-block w-1 h-3 bg-foreground/60 ml-0.5 animate-pulse" />}
                </div>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-white/[0.06] p-4 flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Aether anything about your campus…" className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60" /><button type="submit" disabled={thinking || !input.trim()} className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center disabled:opacity-40"><Send className="h-4 w-4" /></button></form>
        </div>
        <div className="border-l border-white/[0.06] p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs"><Brain className="h-4 w-4 text-cyan" /><span className="font-semibold">Quick prompts</span></div>
          <div className="space-y-1.5">{quick.map((qq) => <button key={qq} onClick={() => send(qq)} disabled={thinking} className="w-full text-left text-[11px] px-3 py-2 rounded-lg glass hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40">{qq}</button>)}</div>
          <div className="text-[10px] text-muted-foreground mt-4">Context: <span className="text-foreground">{section}</span></div>
        </div>
      </div>
    </SectionShell>
  );
}