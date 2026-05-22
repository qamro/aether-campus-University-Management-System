// Mock service layer that simulates a realistic SaaS backend with async latency.

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms + Math.random() * 300));

export type Role = "admin" | "provost" | "faculty" | "student";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  institution?: string;
  token: string;
}

export const authApi = {
  async signup(input: { name: string; email: string; password: string; institution?: string }): Promise<AuthUser> {
    await delay(900);
    if (input.email.endsWith("@blocked.com")) throw new Error("This email domain is not permitted.");
    return {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      role: "provost",
      institution: input.institution,
      token: `ac_${crypto.randomUUID()}`,
    };
  },
  async login(input: { email: string; password: string }): Promise<AuthUser> {
    await delay(700);
    if (input.password === "wrong") throw new Error("Invalid credentials. Please try again.");
    return {
      id: "u_helena",
      name: "Helena Voss",
      email: input.email,
      role: "provost",
      institution: "Aether University",
      token: `ac_${crypto.randomUUID()}`,
    };
  },
  async logout(): Promise<void> {
    await delay(200);
  },
};

export interface Plan {
  id: "foundation" | "scale" | "enterprise";
  name: string;
  monthly: number | null; // null = custom
  yearly: number | null;
  featured?: boolean;
}

export const pricingApi = {
  async fetchPlans(): Promise<Plan[]> {
    await delay(300);
    return [
      { id: "foundation", name: "Foundation", monthly: 2400, yearly: 24000 },
      { id: "scale", name: "Scale", monthly: 7800, yearly: 78000, featured: true },
      { id: "enterprise", name: "Enterprise", monthly: null, yearly: null },
    ];
  },
  async subscribe(planId: Plan["id"]): Promise<{ subscriptionId: string; planId: Plan["id"] }> {
    await delay(1200);
    if (planId === "enterprise") throw new Error("Enterprise plans require a sales conversation.");
    return { subscriptionId: `sub_${crypto.randomUUID()}`, planId };
  },
};

export const contactApi = {
  async send(input: { name: string; email: string; subject: string; message: string }): Promise<{ ticketId: string }> {
    await delay(1100);
    if (!input.email.includes("@")) throw new Error("Invalid email.");
    return { ticketId: `TKT-${Math.floor(Math.random() * 99999).toString().padStart(5, "0")}` };
  },
};

export const aiApi = {
  async ask(prompt: string): Promise<string> {
    await delay(900);
    const canned: Record<string, string> = {
      enrollment: "Projected enrollment is up 14% next semester. I've identified 3 sections to open in CS and 2 in Mathematics.",
      attendance: "Attendance dipped 6% this week, concentrated in CS-301 and ECO-210. I drafted outreach to 42 students.",
      students: "There are 24,812 active students across 7 faculties. 312 are flagged at-risk; 7 require urgent intervention.",
    };
    const key = Object.keys(canned).find((k) => prompt.toLowerCase().includes(k));
    if (key) return canned[key];
    return `I analyzed your campus signals for "${prompt}". No anomalies detected — engagement is trending +0.3 standard deviations above baseline.`;
  },
  // Simulated token-by-token stream.
  async *stream(prompt: string, context?: string): AsyncGenerator<string> {
    const full = await this.askWithContext(prompt, context);
    const tokens = full.split(/(\s+)/);
    for (const t of tokens) {
      await new Promise((r) => setTimeout(r, 18 + Math.random() * 42));
      yield t;
    }
  },
  async askWithContext(prompt: string, context?: string): Promise<string> {
    await delay(400);
    const base = await this.ask(prompt);
    if (!context) return base;
    return `[${context}] ${base}`;
  },
  insights(section: string): string[] {
    const map: Record<string, string[]> = {
      Overview: [
        "Enrollment momentum is the strongest in 3 years — consider expanding STEM sections.",
        "Engagement up 0.3σ over baseline. 7 at-risk students need intervention this week.",
      ],
      Students: [
        "312 students flagged at-risk. Top driver: missed assignments in CS-301.",
        "Mentorship coverage at 86% — 42 freshmen still unmatched.",
      ],
      Faculty: [
        "Engineering faculty utilization at 112% — overload risk for Q2.",
        "3 faculty members eligible for sabbatical rotation next term.",
      ],
      Courses: [
        "CS-220 demand exceeds capacity by 41 seats. Recommend opening 2 sections.",
        "ECO-210 attendance dropped 18%. Worth a syllabus review.",
      ],
      Schedule: [
        "2 timetable conflicts detected for Wednesday lecture block.",
        "Optimal lecture window: Tue/Thu 10:00 — 14% higher attendance.",
      ],
      Analytics: [
        "Cohort retention up 2.1% YoY. AI-mentored cohort outperforms control by 8%.",
        "Forecast: 14% enrollment surge next semester. Plan capacity now.",
      ],
      Messages: [
        "12 conversations unread from faculty. 3 marked urgent.",
      ],
    };
    return map[section] ?? ["Monitoring all campus signals — no anomalies detected."];
  },
};

// ──────────────────────────────────────────────────────────────
// Courses
// ──────────────────────────────────────────────────────────────
export type CourseStatus = "active" | "archived" | "upcoming";
export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  level: "Undergraduate" | "Graduate" | "PhD";
  semester: "Fall" | "Spring" | "Summer";
  status: CourseStatus;
  enrolled: number;
  capacity: number;
  progress: number; // 0-100
  facultyId: string;
}

const seedCourses: Course[] = [
  { id: "c1", code: "CS-220", title: "Algorithms & Data Structures", department: "Computer Science", level: "Undergraduate", semester: "Spring", status: "active", enrolled: 184, capacity: 200, progress: 62, facultyId: "f1" },
  { id: "c2", code: "CS-301", title: "Operating Systems", department: "Computer Science", level: "Undergraduate", semester: "Spring", status: "active", enrolled: 142, capacity: 160, progress: 58, facultyId: "f2" },
  { id: "c3", code: "MATH-401", title: "Real Analysis", department: "Mathematics", level: "Graduate", semester: "Spring", status: "active", enrolled: 38, capacity: 40, progress: 71, facultyId: "f3" },
  { id: "c4", code: "ECO-210", title: "Macroeconomic Theory", department: "Economics", level: "Undergraduate", semester: "Spring", status: "active", enrolled: 96, capacity: 120, progress: 49, facultyId: "f4" },
  { id: "c5", code: "AI-550", title: "Deep Learning Systems", department: "Computer Science", level: "Graduate", semester: "Fall", status: "upcoming", enrolled: 0, capacity: 80, progress: 0, facultyId: "f1" },
  { id: "c6", code: "HIST-120", title: "World Civilizations", department: "History", level: "Undergraduate", semester: "Fall", status: "archived", enrolled: 210, capacity: 220, progress: 100, facultyId: "f5" },
  { id: "c7", code: "BIO-330", title: "Molecular Biology", department: "Biology", level: "Undergraduate", semester: "Spring", status: "active", enrolled: 78, capacity: 100, progress: 64, facultyId: "f6" },
  { id: "c8", code: "PHIL-210", title: "Ethics of AI", department: "Philosophy", level: "Undergraduate", semester: "Spring", status: "active", enrolled: 124, capacity: 140, progress: 55, facultyId: "f7" },
];

export const coursesApi = {
  async list(): Promise<Course[]> { await delay(400); return seedCourses; },
  async create(input: Omit<Course, "id" | "progress" | "enrolled">): Promise<Course> {
    await delay(500);
    return { ...input, id: crypto.randomUUID(), enrolled: 0, progress: 0 };
  },
  async update(id: string, patch: Partial<Course>): Promise<{ id: string; patch: Partial<Course> }> {
    await delay(350); return { id, patch };
  },
  async remove(id: string): Promise<{ id: string }> { await delay(300); return { id }; },
};

// ──────────────────────────────────────────────────────────────
// Students
// ──────────────────────────────────────────────────────────────
export type StudentStatus = "active" | "probation" | "graduated" | "leave";
export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  year: 1 | 2 | 3 | 4 | 5;
  gpa: number;
  attendance: number; // %
  status: StudentStatus;
  enrolledCourses: string[];
  riskScore: number; // 0-100
}

const firstNames = ["Maya","Lucas","Aiden","Sofia","Noah","Emma","Liam","Olivia","Ethan","Ava","Mason","Isabella","Logan","Mia","James","Charlotte","Benjamin","Amelia","Jacob","Harper","Ryan","Zoe","Aria","Leo","Nora","Kai","Eli","Iris","Theo","Luna"];
const lastNames = ["Okafor","Chen","Patel","Garcia","Müller","Singh","Rossi","Yamamoto","Kim","Silva","Larsen","Costa","Dubois","Hassan","Park","Nguyen","Andersson","Schmidt","Lopez","Khan"];
const programs = ["Computer Science","Mathematics","Economics","Biology","Philosophy","History","Mechanical Eng.","Physics"];
const seedStudents: Student[] = Array.from({ length: 64 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[(i * 3) % lastNames.length];
  const gpa = +(2.4 + Math.random() * 1.6).toFixed(2);
  const attendance = Math.round(60 + Math.random() * 40);
  const risk = Math.max(0, Math.round(((4 - gpa) * 30 + (100 - attendance)) / 2));
  return {
    id: `s${i + 1}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@aether.edu`,
    program: programs[i % programs.length],
    year: ((i % 5) + 1) as Student["year"],
    gpa,
    attendance,
    status: risk > 60 ? "probation" : i % 23 === 0 ? "leave" : "active",
    enrolledCourses: seedCourses.slice(0, 2 + (i % 3)).map((c) => c.id),
    riskScore: risk,
  };
});

export const studentsApi = {
  async list(): Promise<Student[]> { await delay(450); return seedStudents; },
  async create(input: Omit<Student, "id" | "riskScore">): Promise<Student> {
    await delay(500);
    return { ...input, id: crypto.randomUUID(), riskScore: 30 };
  },
  async update(id: string, patch: Partial<Student>) { await delay(300); return { id, patch }; },
  async remove(id: string) { await delay(300); return { id }; },
  async bulkRemove(ids: string[]) { await delay(500); return { ids }; },
};

// ──────────────────────────────────────────────────────────────
// Faculty
// ──────────────────────────────────────────────────────────────
export type FacultyAvailability = "available" | "in-class" | "on-leave";
export interface Faculty {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  availability: FacultyAvailability;
  rating: number; // 0-5
  publications: number;
  courseIds: string[];
}

const seedFaculty: Faculty[] = [
  { id: "f1", name: "Dr. Helena Voss", title: "Professor", department: "Computer Science", email: "h.voss@aether.edu", availability: "available", rating: 4.8, publications: 84, courseIds: ["c1","c5"] },
  { id: "f2", name: "Dr. Marcus Chen", title: "Associate Prof.", department: "Computer Science", email: "m.chen@aether.edu", availability: "in-class", rating: 4.6, publications: 41, courseIds: ["c2"] },
  { id: "f3", name: "Dr. Lena Müller", title: "Professor", department: "Mathematics", email: "l.muller@aether.edu", availability: "available", rating: 4.9, publications: 102, courseIds: ["c3"] },
  { id: "f4", name: "Dr. Aditya Patel", title: "Assistant Prof.", department: "Economics", email: "a.patel@aether.edu", availability: "available", rating: 4.4, publications: 22, courseIds: ["c4"] },
  { id: "f5", name: "Dr. Sofia Rossi", title: "Professor", department: "History", email: "s.rossi@aether.edu", availability: "on-leave", rating: 4.7, publications: 67, courseIds: ["c6"] },
  { id: "f6", name: "Dr. Kenji Yamamoto", title: "Associate Prof.", department: "Biology", email: "k.yamamoto@aether.edu", availability: "in-class", rating: 4.5, publications: 58, courseIds: ["c7"] },
  { id: "f7", name: "Dr. Iris Andersson", title: "Professor", department: "Philosophy", email: "i.andersson@aether.edu", availability: "available", rating: 4.9, publications: 73, courseIds: ["c8"] },
];

export const facultyApi = {
  async list(): Promise<Faculty[]> { await delay(400); return seedFaculty; },
  async assignCourse(facultyId: string, courseId: string) { await delay(300); return { facultyId, courseId }; },
  async unassignCourse(facultyId: string, courseId: string) { await delay(300); return { facultyId, courseId }; },
  async update(id: string, patch: Partial<Faculty>) { await delay(300); return { id, patch }; },
};

// ──────────────────────────────────────────────────────────────
// Schedule / Timetable
// ──────────────────────────────────────────────────────────────
export type EventCategory = "lecture" | "exam" | "meeting" | "lab";
export interface ScheduleEvent {
  id: string;
  title: string;
  category: EventCategory;
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Mon
  start: number; // hour 8-20
  duration: number; // hours
  location: string;
  facultyId?: string;
  courseId?: string;
}
const seedSchedule: ScheduleEvent[] = [
  { id: "e1", title: "CS-220 Lecture", category: "lecture", day: 0, start: 9, duration: 1.5, location: "Hall A1", facultyId: "f1", courseId: "c1" },
  { id: "e2", title: "Board sync", category: "meeting", day: 0, start: 14, duration: 1, location: "Strategy room" },
  { id: "e3", title: "CS-301 Lab", category: "lab", day: 1, start: 10, duration: 2, location: "Lab 3B", facultyId: "f2", courseId: "c2" },
  { id: "e4", title: "MATH-401 Lecture", category: "lecture", day: 2, start: 11, duration: 1.5, location: "Hall C2", facultyId: "f3", courseId: "c3" },
  { id: "e5", title: "ECO-210 Midterm", category: "exam", day: 3, start: 9, duration: 2, location: "Auditorium", facultyId: "f4", courseId: "c4" },
  { id: "e6", title: "Faculty review", category: "meeting", day: 3, start: 15, duration: 1, location: "Room 204" },
  { id: "e7", title: "BIO-330 Lecture", category: "lecture", day: 4, start: 10, duration: 1.5, location: "Hall B3", facultyId: "f6", courseId: "c7" },
  { id: "e8", title: "PHIL-210 Seminar", category: "lecture", day: 4, start: 13, duration: 1.5, location: "Hall A2", facultyId: "f7", courseId: "c8" },
];

export const scheduleApi = {
  async list(): Promise<ScheduleEvent[]> { await delay(350); return seedSchedule; },
  async create(input: Omit<ScheduleEvent, "id">): Promise<ScheduleEvent> {
    await delay(400); return { ...input, id: crypto.randomUUID() };
  },
  async update(id: string, patch: Partial<ScheduleEvent>) { await delay(300); return { id, patch }; },
  async remove(id: string) { await delay(300); return { id }; },
};

// ──────────────────────────────────────────────────────────────
// Messages
// ──────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  threadId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: number;
  fromSelf?: boolean;
}
export interface Thread {
  id: string;
  subject: string;
  participant: string;
  initials: string;
  preview: string;
  unread: boolean;
  archived: boolean;
  updatedAt: number;
  messages: Message[];
}

const now = Date.now();
const seedThreads: Thread[] = [
  {
    id: "t1", subject: "Q2 capacity expansion", participant: "Dr. Marcus Chen", initials: "MC",
    preview: "Looping in registrar — we'll need 2 extra sections…", unread: true, archived: false, updatedAt: now - 1000 * 60 * 8,
    messages: [
      { id: "m1", threadId: "t1", authorName: "Dr. Marcus Chen", authorInitials: "MC", content: "Helena — enrollment forecast for CS exceeds capacity by 41 seats. Can we approve 2 extra sections?", createdAt: now - 1000 * 60 * 60 },
      { id: "m2", threadId: "t1", authorName: "You", authorInitials: "HV", content: "Yes — Aether already drafted them. Forwarding to registrar.", createdAt: now - 1000 * 60 * 45, fromSelf: true },
      { id: "m3", threadId: "t1", authorName: "Dr. Marcus Chen", authorInitials: "MC", content: "Looping in registrar — we'll need 2 extra sections and a TA reassignment.", createdAt: now - 1000 * 60 * 8 },
    ],
  },
  {
    id: "t2", subject: "Mentor pairing recommendations", participant: "Aether AI", initials: "AI",
    preview: "I've matched 12 freshmen with senior mentors based on…", unread: true, archived: false, updatedAt: now - 1000 * 60 * 22,
    messages: [
      { id: "m4", threadId: "t2", authorName: "Aether AI", authorInitials: "AI", content: "I've matched 12 freshmen with senior mentors based on program, interests, and engagement signals.", createdAt: now - 1000 * 60 * 22 },
    ],
  },
  {
    id: "t3", subject: "Sabbatical request — Spring 2027", participant: "Dr. Sofia Rossi", initials: "SR",
    preview: "Submitting my formal request for review.", unread: false, archived: false, updatedAt: now - 1000 * 60 * 60 * 3,
    messages: [
      { id: "m5", threadId: "t3", authorName: "Dr. Sofia Rossi", authorInitials: "SR", content: "Submitting my formal request for review.", createdAt: now - 1000 * 60 * 60 * 3 },
    ],
  },
  {
    id: "t4", subject: "Lab 3B equipment", participant: "Facilities", initials: "FC",
    preview: "Replacement units arrive Friday — confirming install slot.", unread: false, archived: true, updatedAt: now - 1000 * 60 * 60 * 30,
    messages: [
      { id: "m6", threadId: "t4", authorName: "Facilities", authorInitials: "FC", content: "Replacement units arrive Friday — confirming install slot.", createdAt: now - 1000 * 60 * 60 * 30 },
    ],
  },
];

export const messagesApi = {
  async list(): Promise<Thread[]> { await delay(400); return seedThreads; },
  async send(threadId: string, content: string): Promise<Message> {
    await delay(350);
    return { id: crypto.randomUUID(), threadId, authorName: "You", authorInitials: "HV", content, createdAt: Date.now(), fromSelf: true };
  },
  async reply(threadId: string): Promise<Message> {
    await delay(1400 + Math.random() * 800);
    const replies = ["Acknowledged — I'll follow up shortly.","Thanks, on it.","Reviewing now, will revert by EOD.","Confirmed, looping in the team."];
    return { id: crypto.randomUUID(), threadId, authorName: "Aether AI", authorInitials: "AI", content: replies[Math.floor(Math.random() * replies.length)], createdAt: Date.now() };
  },
};

// ──────────────────────────────────────────────────────────────
// Analytics
// ──────────────────────────────────────────────────────────────
export type TimeRange = "day" | "week" | "month" | "year";
export interface AnalyticsSeries { label: string; current: number; previous: number; }
export interface AnalyticsSnapshot {
  range: TimeRange;
  kpis: { label: string; value: number; previous: number; format: "int" | "pct" | "score" }[];
  enrollment: AnalyticsSeries[];
  engagement: AnalyticsSeries[];
  departmentSplit: { name: string; value: number }[];
}

function gen(range: TimeRange) {
  const len = range === "day" ? 24 : range === "week" ? 7 : range === "month" ? 30 : 12;
  const labels =
    range === "day" ? Array.from({ length: 24 }, (_, i) => `${i}h`) :
    range === "week" ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] :
    range === "month" ? Array.from({ length: 30 }, (_, i) => `${i + 1}`) :
    ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return labels.slice(0, len).map((label) => ({
    label,
    current: Math.round(40 + Math.random() * 60),
    previous: Math.round(35 + Math.random() * 55),
  }));
}

export const analyticsApi = {
  async snapshot(range: TimeRange): Promise<AnalyticsSnapshot> {
    await delay(500);
    return {
      range,
      kpis: [
        { label: "Active students", value: 24812, previous: 23800, format: "int" },
        { label: "Graduation rate", value: 94.1, previous: 92.3, format: "pct" },
        { label: "Courses live", value: 1284, previous: 1272, format: "int" },
        { label: "Engagement", value: 8.7, previous: 8.4, format: "score" },
      ],
      enrollment: gen(range),
      engagement: gen(range),
      departmentSplit: [
        { name: "Computer Science", value: 4820 },
        { name: "Engineering", value: 3960 },
        { name: "Mathematics", value: 2410 },
        { name: "Economics", value: 2850 },
        { name: "Biology", value: 2030 },
        { name: "Humanities", value: 3540 },
        { name: "Other", value: 5202 },
      ],
    };
  },
};
