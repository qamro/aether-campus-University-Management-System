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
};
