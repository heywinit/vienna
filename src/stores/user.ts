import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserInfo {
  name: string;
  email: string;
  avatar?: string; // Can be a URL, emoji, or icon name
}

interface UserState {
  user: UserInfo;
  updateUser: (updates: Partial<UserInfo>) => void;
}

const defaultUser: UserInfo = {
  name: "",
  email: "",
  avatar: undefined,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: defaultUser,
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),
    }),
    { name: "user-store" }
  )
);
