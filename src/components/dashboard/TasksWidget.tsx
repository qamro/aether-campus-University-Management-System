import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDashboard, type Task } from "@/lib/dashboard/store";

const priorityStyle: Record<Task["priority"], string> = {
  low: "bg-muted-foreground/20 text-muted-foreground",
  med: "bg-cyan/15 text-cyan",
  high: "bg-destructive/20 text-destructive",
};

export function TasksWidget() {
  const tasks = useDashboard((s) => s.tasks);
  const addTask = useDashboard((s) => s.addTask);
  const toggleTask = useDashboard((s) => s.toggleTask);
  const removeTask = useDashboard((s) => s.removeTask);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("med");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  const filtered = tasks.filter((t) => (filter === "all" ? true : filter === "open" ? !t.done : t.done));
  const openCount = tasks.filter((t) => !t.done).length;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title.trim(), priority);
    setTitle("");
  }

  return (
    <div className="rounded-2xl glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-foreground">Provost tasks</div>
          <div className="text-xs text-muted-foreground mt-0.5">{openCount} open</div>
        </div>
        <div className="flex gap-1 text-[10px]">
          {(["all", "open", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-md transition-colors capitalize ${
                filter === f ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task…"
          className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task["priority"])}
          className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-2 py-2 text-xs text-foreground outline-none"
        >
          <option value="low">Low</option>
          <option value="med">Med</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="px-3 rounded-lg bg-foreground text-background flex items-center justify-center"
          aria-label="Add task"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </form>

      <ul className="space-y-1.5">
        <AnimatePresence initial={false}>
          {filtered.length === 0 && (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-muted-foreground py-8"
            >
              No tasks to show.
            </motion.li>
          )}
          {filtered.map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <button
                onClick={() => toggleTask(t.id)}
                className={`h-4 w-4 rounded-md border transition-all flex items-center justify-center shrink-0 ${
                  t.done ? "bg-aurora border-transparent" : "border-white/20 hover:border-primary"
                }`}
                aria-label="Toggle task"
              >
                {t.done && (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
                    <path d="M2 6l3 3 5-6" stroke="oklch(0.12 0.02 260)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className={`flex-1 text-xs min-w-0 truncate ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {t.title}
              </span>
              <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${priorityStyle[t.priority]}`}>
                {t.priority}
              </span>
              <button
                onClick={() => removeTask(t.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                aria-label="Delete task"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
