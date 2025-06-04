import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NoteNodeType = "file" | "folder";

export interface NoteNode {
  id: string;
  parentId: string | null; // null for root
  type: NoteNodeType;
  name: string;
  content?: string; // only for files
  created: string; // ISO string
  updated: string; // ISO string
  deleted?: boolean;
}

interface NotesState {
  notes: NoteNode[];
  addFile: (file: Omit<NoteNode, "type">) => void;
  addFolder: (folder: Omit<NoteNode, "type" | "content">) => void;
  updateFile: (
    id: string,
    updates: Partial<Pick<NoteNode, "name" | "content" | "updated">>
  ) => void;
  renameNode: (id: string, newName: string) => void;
  moveNode: (id: string, newParentId: string | null) => void;
  deleteNode: (id: string) => void;
  restoreNode: (id: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      addFile: (file) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...file,
              type: "file",
              created: new Date().toISOString(),
              updated: new Date().toISOString(),
            },
          ],
        })),
      addFolder: (folder) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...folder,
              type: "folder",
              created: new Date().toISOString(),
              updated: new Date().toISOString(),
            },
          ],
        })),
      updateFile: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id && n.type === "file"
              ? {
                  ...n,
                  ...updates,
                  updated: updates.updated || new Date().toISOString(),
                }
              : n
          ),
        })),
      renameNode: (id, newName) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, name: newName, updated: new Date().toISOString() }
              : n
          ),
        })),
      moveNode: (id, newParentId) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  parentId: newParentId,
                  updated: new Date().toISOString(),
                }
              : n
          ),
        })),
      deleteNode: (id) => {
        // Soft delete: set deleted to true for node and all children
        const collectIds = (targetId: string, notes: NoteNode[]): string[] => {
          const children = notes.filter((n) => n.parentId === targetId);
          return [
            targetId,
            ...children.flatMap((child) => collectIds(child.id, notes)),
          ];
        };
        set((state) => {
          const idsToDelete = collectIds(id, state.notes);
          return {
            notes: state.notes.map((n) =>
              idsToDelete.includes(n.id) ? { ...n, deleted: true } : n
            ),
          };
        });
      },
      restoreNode: (id) => {
        // Restore: set deleted to false for node and all children
        const collectIds = (targetId: string, notes: NoteNode[]): string[] => {
          const children = notes.filter((n) => n.parentId === targetId);
          return [
            targetId,
            ...children.flatMap((child) => collectIds(child.id, notes)),
          ];
        };
        set((state) => {
          const idsToRestore = collectIds(id, state.notes);
          return {
            notes: state.notes.map((n) =>
              idsToRestore.includes(n.id) ? { ...n, deleted: false } : n
            ),
          };
        });
      },
    }),
    { name: "notes-store" }
  )
);
