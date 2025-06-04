import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  created: string; // ISO string
  project?: string; // project id (optional)
}

interface BookmarksState {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  removeBookmark: (id: string) => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set) => ({
      bookmarks: [],
      addBookmark: (bookmark) =>
        set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
      updateBookmark: (id, updates) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),
    }),
    { name: "bookmarks-store" }
  )
);
