import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  deleted?: boolean;
}

interface TagsState {
  tags: Tag[];
  addTag: (tag: Omit<Tag, "id" | "deleted"> & { id?: string }) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  removeTag: (id: string) => void;
  restoreTag: (id: string) => void;
}

export const useTagsStore = create<TagsState>()(
  persist(
    (set) => ({
      tags: [],
      addTag: (tag) => {
        const id = tag.id || `${tag.name}-${Date.now()}`;
        set((state) => ({
          tags: [
            ...state.tags,
            {
              ...tag,
              id,
              deleted: false,
            },
          ],
        }));
      },
      updateTag: (id, updates) =>
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      removeTag: (id) =>
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, deleted: true } : t
          ),
        })),
      restoreTag: (id) =>
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, deleted: false } : t
          ),
        })),
    }),
    { name: "tags-store" }
  )
);
