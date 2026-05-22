import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, Faculty, Message, ScheduleEvent, Student, Thread } from "@/lib/mock-api";

export interface Task {
  id: string;
  title: string;
  priority: "low" | "med" | "high";
  done: boolean;
  createdAt: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: "system" | "ai" | "academic" | "alert";
  read: boolean;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  createdAt: number;
  streaming?: boolean;
  context?: string;
}

export type Section = "Overview" | "Students" | "Faculty" | "Schedule" | "Courses" | "Analytics" | "Aether AI" | "Messages";

interface DashboardState {
  tasks: Task[];
  notifications: Notification[];
  chat: ChatMessage[];
  searchQuery: string;
  activeSection: Section;
  setSection: (s: Section) => void;
  // entities
  courses: Course[]; coursesLoaded: boolean; setCourses: (c: Course[]) => void;
  upsertCourse: (c: Course) => void; patchCourse: (id: string, patch: Partial<Course>) => void; deleteCourse: (id: string) => void;
  students: Student[]; studentsLoaded: boolean; setStudents: (s: Student[]) => void;
  upsertStudent: (s: Student) => void; patchStudent: (id: string, patch: Partial<Student>) => void; deleteStudents: (ids: string[]) => void;
  faculty: Faculty[]; facultyLoaded: boolean; setFaculty: (f: Faculty[]) => void;
  patchFaculty: (id: string, patch: Partial<Faculty>) => void;
  schedule: ScheduleEvent[]; scheduleLoaded: boolean; setSchedule: (e: ScheduleEvent[]) => void;
  upsertEvent: (e: ScheduleEvent) => void; patchEvent: (id: string, patch: Partial<ScheduleEvent>) => void; deleteEvent: (id: string) => void;
  threads: Thread[]; threadsLoaded: boolean; setThreads: (t: Thread[]) => void;
  activeThreadId: string | null; setActiveThread: (id: string | null) => void;
  appendThreadMessage: (threadId: string, m: Message) => void;
  markThreadRead: (threadId: string) => void;
  toggleArchiveThread: (threadId: string) => void;
  // actions
  addTask: (title: string, priority?: Task["priority"]) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  editTask: (id: string, patch: Partial<Pick<Task, "title" | "priority">>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  pushNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  appendMessage: (m: Omit<ChatMessage, "id" | "createdAt">) => void;
  patchMessage: (id: string, patch: Partial<ChatMessage>) => void;
  clearChat: () => void;
  setSearch: (q: string) => void;
}

const seedTasks: Task[] = [
  { id: "t1", title: "Review at-risk student outreach plan", priority: "high", done: false, createdAt: Date.now() - 1000 * 60 * 60 },
  { id: "t2", title: "Approve Q2 capacity expansion in Engineering", priority: "med", done: false, createdAt: Date.now() - 1000 * 60 * 30 },
  { id: "t3", title: "Draft board summary for AI rollout phase 2", priority: "low", done: true, createdAt: Date.now() - 1000 * 60 * 120 },
];

const seedNotifications: Notification[] = [
  { id: "n1", title: "Attendance anomaly", body: "CS-301 dropped 18% this week.", category: "alert", read: false, createdAt: Date.now() - 1000 * 60 * 2 },
  { id: "n2", title: "Aether predicted overload", body: "Engineering — Q2 capacity at 112%.", category: "ai", read: false, createdAt: Date.now() - 1000 * 60 * 14 },
  { id: "n3", title: "12 new mentor matches", body: "Freshmen matched with senior mentors.", category: "academic", read: true, createdAt: Date.now() - 1000 * 60 * 60 },
  { id: "n4", title: "System maintenance scheduled", body: "Sunday 02:00 UTC — 20 min window.", category: "system", read: true, createdAt: Date.now() - 1000 * 60 * 60 * 5 },
];

export const useDashboard = create<DashboardState>()(
  persist(
    (set) => ({
      tasks: seedTasks,
      notifications: seedNotifications,
      chat: [
        { id: "m0", role: "ai", content: "Good morning. I'm monitoring 24,812 students across 7 faculties. Ask me anything.", createdAt: Date.now() },
      ],
      searchQuery: "",
      activeSection: "Overview",
      setSection: (activeSection) => set({ activeSection }),
      courses: [], coursesLoaded: false,
      setCourses: (courses) => set({ courses, coursesLoaded: true }),
      upsertCourse: (c) => set((s) => ({ courses: s.courses.some((x) => x.id === c.id) ? s.courses.map((x) => x.id === c.id ? c : x) : [c, ...s.courses] })),
      patchCourse: (id, patch) => set((s) => ({ courses: s.courses.map((c) => c.id === id ? { ...c, ...patch } : c) })),
      deleteCourse: (id) => set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),
      students: [], studentsLoaded: false,
      setStudents: (students) => set({ students, studentsLoaded: true }),
      upsertStudent: (st) => set((s) => ({ students: s.students.some((x) => x.id === st.id) ? s.students.map((x) => x.id === st.id ? st : x) : [st, ...s.students] })),
      patchStudent: (id, patch) => set((s) => ({ students: s.students.map((x) => x.id === id ? { ...x, ...patch } : x) })),
      deleteStudents: (ids) => set((s) => ({ students: s.students.filter((x) => !ids.includes(x.id)) })),
      faculty: [], facultyLoaded: false,
      setFaculty: (faculty) => set({ faculty, facultyLoaded: true }),
      patchFaculty: (id, patch) => set((s) => ({ faculty: s.faculty.map((f) => f.id === id ? { ...f, ...patch } : f) })),
      schedule: [], scheduleLoaded: false,
      setSchedule: (schedule) => set({ schedule, scheduleLoaded: true }),
      upsertEvent: (e) => set((s) => ({ schedule: s.schedule.some((x) => x.id === e.id) ? s.schedule.map((x) => x.id === e.id ? e : x) : [...s.schedule, e] })),
      patchEvent: (id, patch) => set((s) => ({ schedule: s.schedule.map((e) => e.id === id ? { ...e, ...patch } : e) })),
      deleteEvent: (id) => set((s) => ({ schedule: s.schedule.filter((e) => e.id !== id) })),
      threads: [], threadsLoaded: false,
      setThreads: (threads) => set({ threads, threadsLoaded: true }),
      activeThreadId: null,
      setActiveThread: (activeThreadId) => set({ activeThreadId }),
      appendThreadMessage: (threadId, m) => set((s) => ({
        threads: s.threads.map((t) => t.id === threadId ? { ...t, messages: [...t.messages, m], preview: m.content.slice(0, 60), updatedAt: m.createdAt } : t),
      })),
      markThreadRead: (threadId) => set((s) => ({ threads: s.threads.map((t) => t.id === threadId ? { ...t, unread: false } : t) })),
      toggleArchiveThread: (threadId) => set((s) => ({ threads: s.threads.map((t) => t.id === threadId ? { ...t, archived: !t.archived } : t) })),
      addTask: (title, priority = "med") =>
        set((s) => ({
          tasks: [{ id: crypto.randomUUID(), title, priority, done: false, createdAt: Date.now() }, ...s.tasks],
        })),
      toggleTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      editTask: (id, patch) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      pushNotification: (n) =>
        set((s) => ({
          notifications: [{ id: crypto.randomUUID(), createdAt: Date.now(), read: false, ...n }, ...s.notifications],
        })),
      appendMessage: (m) =>
        set((s) => ({
          chat: [...s.chat, { id: crypto.randomUUID(), createdAt: Date.now(), ...m }],
        })),
      patchMessage: (id, patch) => set((s) => ({ chat: s.chat.map((m) => m.id === id ? { ...m, ...patch } : m) })),
      clearChat: () => set({ chat: [{ id: "m0", role: "ai", content: "Conversation cleared. What's next?", createdAt: Date.now() }] }),
      setSearch: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: "aether-dashboard",
      partialize: (s) => ({
        tasks: s.tasks,
        notifications: s.notifications,
        chat: s.chat,
        activeSection: s.activeSection,
      }),
    }
  )
);
