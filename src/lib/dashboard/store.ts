import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

interface DashboardState {
  tasks: Task[];
  notifications: Notification[];
  chat: ChatMessage[];
  searchQuery: string;
  addTask: (title: string, priority?: Task["priority"]) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  editTask: (id: string, patch: Partial<Pick<Task, "title" | "priority">>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  pushNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  appendMessage: (m: Omit<ChatMessage, "id" | "createdAt">) => void;
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
      setSearch: (searchQuery) => set({ searchQuery }),
    }),
    { name: "aether-dashboard" }
  )
);
