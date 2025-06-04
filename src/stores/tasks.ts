import { create } from "zustand";
import { persist } from "zustand/middleware";

// Task and related types
export type TaskStatus = "todo" | "in-progress" | "done" | "blocked";
export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskType = "task" | "event";

export interface Annotation {
  time: string; // ISO string
  text: string;
}

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  title: string;
  project: string; // project id
  tags: string[];
  description: string;
  created: string; // ISO string
  started: string; // ISO string
  ended?: string; // ISO string | undefined
  dependencies: string[]; // task ids
  dueDate?: string; // ISO string | undefined
  priority: Priority;
  annotations: Annotation[];
  deleted?: boolean;
}

interface TasksState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  addAnnotation: (taskId: string, annotation: Annotation) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      addAnnotation: (taskId, annotation) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, annotations: [...t.annotations, annotation] }
              : t
          ),
        })),
    }),
    { name: "tasks-store" }
  )
);
