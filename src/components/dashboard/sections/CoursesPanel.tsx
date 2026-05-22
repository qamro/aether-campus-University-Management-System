import { motion, AnimatePresence } from "framer-motion";
import { Archive, BookOpen, Plus, Search, Trash2, X, Edit3 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/lib/dashboard/store";
import { coursesApi, type Course, type CourseStatus } from "@/lib/mock-api";
import { useCoursesData, useDebounced } from "@/lib/dashboard/hooks";
import { SectionShell, EmptyState, LoadingState } from "./SectionShell";

const statusColor: Record<CourseStatus, string> = {
  active: "bg-cyan/15 text-cyan",
  upcoming: "bg-violet/15 text-violet",
  archived: "bg-muted-foreground/15 text-muted-foreground",
};

export function CoursesPanel() {
  const { courses, loaded } = useCoursesData();
  const upsert = useDashboard((s) => s.upsertCourse);
  const patch = useDashboard((s) => s.patchCourse);
  const remove = useDashboard((s) => s.deleteCourse);

  const [query, setQuery] = useState("");
  const dq = useDebounced(query, 200);
  const [dept, setDept] = useState("all");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [modal, setModal] = useState<Course | "new" | null>(null);

  const departments = useMemo(() => Array.from(new Set(courses.map((c) => c.department))), [courses]);

  const filtered = useMemo(() => courses.filter((c) => {
    if (dept !== "all" && c.department !== dept) return false;
    if (level !== "all" && c.level !== level) return false;
    if (status !== "all" && c.status !== status) return false;
    if (dq) { const q = dq.toLowerCase(); return c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q); }
    return true;
  }), [courses, dq, dept, level, status]);

  async function handleDelete(id: string) {
    const prev = courses.find((c) => c.id === id);
    remove(id);
    try { await coursesApi.remove(id); toast.success("Course deleted"); }
    catch { if (prev) upsert(prev); toast.error("Failed to delete"); }
  }

  async function handleEnroll(id: string) {
    const c = courses.find((x) => x.id === id); if (!c) return;
    if (c.enrolled >= c.capacity) { toast.error("Course at capacity"); return; }
    patch(id, { enrolled: c.enrolled + 1 });
    await coursesApi.update(id, { enrolled: c.enrolled + 1 });
    toast.success(`Enrolled into ${c.code}`);
  }

  return (
    <SectionShell
      title="Courses"
      subtitle={`${courses.length} courses across ${departments.length} departments`}
      insightSection="Courses"
      actions={
        <button onClick={() => setModal("new")} className="bg-foreground text-background rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> New course
        </button>
      }
    >
      <div className="rounded-2xl glass p-4 flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-60 flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses…" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none" />
        </div>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs"><option value="all">All depts</option>{departments.map((d) => <option key={d}>{d}</option>)}</select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs"><option value="all">All levels</option><option>Undergraduate</option><option>Graduate</option><option>PhD</option></select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs"><option value="all">All status</option><option value="active">Active</option><option value="upcoming">Upcoming</option><option value="archived">Archived</option></select>
      </div>

      {!loaded ? <LoadingState /> : filtered.length === 0 ? <EmptyState label="No courses match your filters." /> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((c) => (
              <motion.div key={c.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                className="rounded-2xl glass p-5 group relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg glass-strong flex items-center justify-center"><BookOpen className="h-4 w-4" strokeWidth={1.75} /></div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-cyan tracking-wider">{c.code}</div>
                      <div className="text-sm font-semibold text-foreground leading-tight">{c.title}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${statusColor[c.status]}`}>{c.status}</span>
                </div>
                <div className="mt-4 text-[11px] text-muted-foreground flex gap-3"><span>{c.department}</span><span>·</span><span>{c.level}</span><span>·</span><span>{c.semester}</span></div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>Enrolled {c.enrolled}/{c.capacity}</span><span>{c.progress}%</span></div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><motion.div className="h-full bg-aurora" initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 0.6 }} /></div>
                </div>
                <div className="mt-4 flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEnroll(c.id)} className="text-[11px] px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-foreground">Enroll</button>
                  <button onClick={() => setModal(c)} className="text-[11px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Edit3 className="h-3 w-3" />Edit</button>
                  <button onClick={() => patch(c.id, { status: c.status === "archived" ? "active" : "archived" })} className="text-[11px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Archive className="h-3 w-3" />Archive</button>
                  <button onClick={() => handleDelete(c.id)} className="ml-auto text-muted-foreground hover:text-destructive p-1"><Trash2 className="h-3 w-3" /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <CourseModal
            course={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSave={async (data) => {
              if (modal === "new") { const created = await coursesApi.create(data); upsert(created); toast.success("Course created"); }
              else { patch(modal.id, data); await coursesApi.update(modal.id, data); toast.success("Course updated"); }
              setModal(null);
            }}
          />
        )}
      </AnimatePresence>
    </SectionShell>
  );
}

function CourseModal({ course, onClose, onSave }: { course: Course | null; onClose: () => void; onSave: (data: Omit<Course, "id" | "progress" | "enrolled">) => void }) {
  const [f, setF] = useState({
    code: course?.code ?? "",
    title: course?.title ?? "",
    department: course?.department ?? "Computer Science",
    level: (course?.level ?? "Undergraduate") as Course["level"],
    semester: (course?.semester ?? "Spring") as Course["semester"],
    status: (course?.status ?? "active") as CourseStatus,
    capacity: course?.capacity ?? 100,
    facultyId: course?.facultyId ?? "f1",
  });
  const inp = "w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm outline-none";
  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
        className="w-full max-w-lg glass-strong rounded-2xl p-6 space-y-3">
        <div className="flex justify-between items-center"><h3 className="text-base font-semibold">{course ? "Edit course" : "New course"}</h3><button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button></div>
        <div className="grid grid-cols-2 gap-3">
          <input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="Code" className={inp} />
          <input type="number" value={f.capacity} onChange={(e) => setF({ ...f, capacity: +e.target.value })} placeholder="Capacity" className={inp} />
          <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title" className={`${inp} col-span-2`} />
          <input value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })} placeholder="Department" className={inp} />
          <select value={f.level} onChange={(e) => setF({ ...f, level: e.target.value as Course["level"] })} className={inp}><option>Undergraduate</option><option>Graduate</option><option>PhD</option></select>
          <select value={f.semester} onChange={(e) => setF({ ...f, semester: e.target.value as Course["semester"] })} className={inp}><option>Fall</option><option>Spring</option><option>Summer</option></select>
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as CourseStatus })} className={inp}><option value="active">Active</option><option value="upcoming">Upcoming</option><option value="archived">Archived</option></select>
        </div>
        <div className="flex justify-end gap-2 pt-2"><button onClick={onClose} className="px-3 py-2 text-xs text-muted-foreground">Cancel</button><button onClick={() => onSave(f)} disabled={!f.code || !f.title} className="px-3 py-2 text-xs rounded-lg bg-foreground text-background font-medium disabled:opacity-40">Save</button></div>
      </motion.div>
    </div>
  );
}