import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TimerSession {
  id: string;
  taskId: string;
  start: string; // ISO string
  end?: string; // ISO string
  duration?: number; // ms, calculated if end exists
  note?: string;
  deleted?: boolean;
}

interface TimersState {
  sessions: TimerSession[];
  addSession: (
    session: Omit<TimerSession, "id" | "duration"> & { id?: string }
  ) => void;
  editSession: (
    id: string,
    updates: Partial<Omit<TimerSession, "id" | "taskId">>
  ) => void;
  deleteSession: (id: string) => void;
  getTaskTotal: (taskId: string) => number;
}

export const useTimersStore = create<TimersState>()(
  persist(
    (set, get) => ({
      sessions: [],
      addSession: (session) => {
        const id = session.id || `${session.taskId}-${Date.now()}`;
        set((state) => ({
          sessions: [
            ...state.sessions,
            {
              ...session,
              id,
              duration:
                session.end && session.start
                  ? new Date(session.end).getTime() -
                    new Date(session.start).getTime()
                  : undefined,
            },
          ],
        }));
      },
      editSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  ...updates,
                  duration:
                    (updates.end || s.end) && (updates.start || s.start)
                      ? new Date(updates.end || s.end!).getTime() -
                        new Date(updates.start || s.start).getTime()
                      : s.duration,
                }
              : s
          ),
        })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        })),
      getTaskTotal: (taskId) => {
        return get()
          .sessions.filter((s) => s.taskId === taskId && s.duration)
          .reduce((acc, s) => acc + (s.duration || 0), 0);
      },
    }),
    { name: "timers-store" }
  )
);
