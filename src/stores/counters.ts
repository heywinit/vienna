import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CounterResetPeriod =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "custom";

export interface CounterHistoryEntry {
  timestamp: string; // ISO string
  amount: number;
  type: "increment" | "decrement" | "set" | "reset";
}

export interface Counter {
  id: string;
  name: string;
  value: number;
  description?: string;
  created: string; // ISO string
  resetPeriod: CounterResetPeriod;
  lastReset: string; // ISO string
  tags: string[];
  history: CounterHistoryEntry[];
  deleted?: boolean;
}

interface CountersState {
  counters: Counter[];
  addCounter: (
    counter: Omit<
      Counter,
      "id" | "created" | "history" | "lastReset" | "deleted"
    > & { id?: string }
  ) => void;
  updateCounter: (
    id: string,
    updates: Partial<Omit<Counter, "id" | "created" | "history" | "lastReset">>
  ) => void;
  incrementCounter: (id: string, amount?: number) => void;
  decrementCounter: (id: string, amount?: number) => void;
  resetCounter: (id: string) => void;
  removeCounter: (id: string) => void;
  restoreCounter: (id: string) => void;
}

export const useCountersStore = create<CountersState>()(
  persist(
    (set) => ({
      counters: [
        {
          id: "hydration",
          name: "Hydration",
          value: 0,
          description: "Track your daily water intake",
          created: new Date().toISOString(),
          resetPeriod: "daily",
          lastReset: new Date().toISOString(),
          tags: [],
          history: [],
          deleted: false,
        },
      ],
      addCounter: (counter) => {
        const id = counter.id || `${counter.name}-${Date.now()}`;
        set((state) => ({
          counters: [
            ...state.counters,
            {
              ...counter,
              id,
              created: new Date().toISOString(),
              value: Math.max(0, counter.value ?? 0),
              resetPeriod: counter.resetPeriod ?? "none",
              lastReset: new Date().toISOString(),
              tags: counter.tags ?? [],
              history: [],
              deleted: false,
            },
          ],
        }));
      },
      updateCounter: (id, updates) =>
        set((state) => ({
          counters: state.counters.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      incrementCounter: (id, amount = 1) =>
        set((state) => ({
          counters: state.counters.map((c) => {
            if (c.id === id && !c.deleted) {
              const newValue = Math.max(0, c.value + amount);
              return {
                ...c,
                value: newValue,
                history: [
                  ...c.history,
                  {
                    timestamp: new Date().toISOString(),
                    amount,
                    type: "increment",
                  },
                ],
              };
            }
            return c;
          }),
        })),
      decrementCounter: (id, amount = 1) =>
        set((state) => ({
          counters: state.counters.map((c) => {
            if (c.id === id && !c.deleted) {
              const newValue = Math.max(0, c.value - amount);
              return {
                ...c,
                value: newValue,
                history: [
                  ...c.history,
                  {
                    timestamp: new Date().toISOString(),
                    amount,
                    type: "decrement",
                  },
                ],
              };
            }
            return c;
          }),
        })),
      resetCounter: (id) =>
        set((state) => ({
          counters: state.counters.map((c) =>
            c.id === id && !c.deleted
              ? {
                  ...c,
                  value: 0,
                  lastReset: new Date().toISOString(),
                  history: [
                    ...c.history,
                    {
                      timestamp: new Date().toISOString(),
                      amount: 0,
                      type: "reset",
                    },
                  ],
                }
              : c
          ),
        })),
      removeCounter: (id) =>
        set((state) => ({
          counters: state.counters.map((c) =>
            c.id === id ? { ...c, deleted: true } : c
          ),
        })),
      restoreCounter: (id) =>
        set((state) => ({
          counters: state.counters.map((c) =>
            c.id === id ? { ...c, deleted: false } : c
          ),
        })),
    }),
    { name: "counters-store" }
  )
);
