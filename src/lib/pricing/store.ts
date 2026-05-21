import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Plan } from "@/lib/mock-api";

type Cycle = "monthly" | "yearly";

interface PricingState {
  cycle: Cycle;
  selectedPlan: Plan["id"] | null;
  activeSubscription: { planId: Plan["id"]; subscriptionId: string } | null;
  setCycle: (c: Cycle) => void;
  selectPlan: (id: Plan["id"]) => void;
  setSubscription: (s: { planId: Plan["id"]; subscriptionId: string }) => void;
}

export const usePricing = create<PricingState>()(
  persist(
    (set) => ({
      cycle: "monthly",
      selectedPlan: "scale",
      activeSubscription: null,
      setCycle: (cycle) => set({ cycle }),
      selectPlan: (selectedPlan) => set({ selectedPlan }),
      setSubscription: (activeSubscription) => set({ activeSubscription }),
    }),
    { name: "aether-pricing" }
  )
);
