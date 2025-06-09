import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserInfo {
  name: string;
  email: string;
}

interface UserState {
  user: UserInfo;
  updateUser: (updates: Partial<UserInfo>) => void;
}

const defaultUser: UserInfo = {
  name: "bigman",
  email: "bigman@gmail.com",
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
